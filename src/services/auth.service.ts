import { sign, verify } from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { DataStoredInToken, TokenData } from "../interface/auth.interface";
import { User } from "../interface/users.interface";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { AppDataSource } from "../database";
import { httpException } from "../exceptions/httpException";
import { compare, hash } from "bcrypt";
import { UserEntity } from "../entities/users.entity";
import { UserService } from "./user.service";

const createToken = (user: User, expiresIn: number = 24 * 60 * 60 * 30): TokenData => {
  const dataStoredInToken: DataStoredInToken = {
    userId: user.user_id,
  };
  const secretKey: string = String(SECRET_KEY);

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
};

const accessToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { userId: user.user_id };
  const accessKey: string = String(SECRET_KEY);
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, accessKey, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Secure; Max-Age=${tokenData.expiresIn};`;
};

export class AuthService extends Repository<UserEntity> {
  public async login(userData: User): Promise<{ cookie: string; findUser: User; accessData: string }> {
    const findUser: User[] = await AppDataSource.query(`SELECT * from user_entity WHERE email = $1`, [userData.email]);
    if (!findUser.length) throw new httpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser[0].password);
    if (!isPasswordMatching) throw new httpException(409, "Invalid Details");

    const tokenData = createToken(findUser[0]);
    const cookie = createCookie(tokenData);
    const accessData = accessToken(findUser[0]);
    return { cookie, findUser: findUser[0], accessData: accessData.token };
  }

  public async refreshToken(token: string): Promise<{ cookie: string }> {
    const { userId } = verify(token, String(SECRET_KEY)) as unknown as DataStoredInToken;
    const foundUser = await UserEntity.findOne({ where: { user_id: userId } });

    if (!foundUser) throw new httpException(409, "User doesn't exist");

    const cookie = accessToken(foundUser);

    return { cookie: cookie.token };
  }

  public async googleAuthentication(userData: User): Promise<{ cookie: string; result: User, accessData: string }> {
    const findUser: User | null = await UserEntity.findOne({ where: { email: userData.email } });
    let data: { cookie: string; result: User, accessData: string };
    if (findUser) {
      const res = await this.login(userData);
      data = { cookie: res.cookie, result: res.findUser, accessData: res.accessData };
    } else {
      const user_id = "usr-" + Math.floor(1000 + Math.random() * 9000);
      const result = await UserEntity.create({ ...userData, user_id }).save();
      const tokenData = createToken(result);
      const cookie = createCookie(tokenData);
      const accessData = accessToken(result);
      data = { cookie, result, accessData: accessData.token };
    }

    return data;
  }
}
