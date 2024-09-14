import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { DataStoredInToken, TokenData } from "../interface/auth.interface";
import { User } from "../interface/users.interface";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { AppDataSource } from "../database";
import { httpException } from "../exceptions/httpException";
import { compare, hash } from "bcrypt";
import { UserEntity } from "../entities/users.entity";

const createToken = (user: User, expiresIn: number = 12 * 60 * 60): TokenData => {
  const dataStoredInToken: DataStoredInToken = {
    userId: user.user_id,
  };
  const secretKey: string = String(SECRET_KEY);

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `${tokenData.token}`;
};

export class AuthService extends Repository<UserEntity> {
  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User[] = await AppDataSource.query(`SELECT * from user_entity WHERE email = $1`, [userData.email]);
    if (!findUser.length) throw new httpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser[0].password);
    if (!isPasswordMatching) throw new httpException(409, "Invalid Details");

    const tokenData = createToken(findUser[0]);
    const cookie = createCookie(tokenData);
    return { cookie, findUser: findUser[0] };
  }
}
