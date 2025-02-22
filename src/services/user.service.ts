import { Repository } from "typeorm";
import { UserEntity } from "../entities/users.entity";
import { User } from "../interface/users.interface";
import { AppDataSource } from "../database";
import { httpException } from "../exceptions/httpException";
import { hash } from "bcrypt";

export class UserService extends Repository<UserEntity> {
  public async createUser(userData: User): Promise<User> {
    const findUser: User[] = await AppDataSource.query(`SELECT email from user_entity WHERE email = $1`, [userData.email]);
    if (findUser.length) throw new httpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const query = `INSERT INTO public.user_entity(
            user_id, first_name, last_name, email, password, phone_number, location, profile_picture)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const createdUser: User[] = await AppDataSource.query(query, [
      'usr-' + Math.floor(1000 + Math.random() * 9000),
      userData.first_name,
      userData.last_name,
      userData.email,
      hashedPassword,
      userData.phone_number,
      userData.location,
      userData.profile_picture
    ]);
    return createdUser[0];
  }
  public async getUsers(): Promise<User[]> {
    return await AppDataSource.query(`SELECT * from user_entity`);
  }

  public async getUserDetails(userId: string): Promise<User> {
    const query = `SELECT * from user_entity WHERE user_id = $1`;
    const user: User[] = await AppDataSource.query(query, [userId]);

    return user[0];
  }

  public async updateUserDetails(userId: string, userData: User): Promise<User | null> {
    const findUser: User | null = await UserEntity.findOne({ where: { user_id: userId } });
    if (!findUser) throw new httpException(409, "User not found");

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    await UserEntity.update({ user_id: userId }, userData);
    const updatedUser: User | null = await UserEntity.findOne({ where: { user_id: userId } });
    return updatedUser;
  }

  public async deleteUserDetails(userId: string): Promise<User | null> {
    const deleteUser: User[] = await AppDataSource.query(`DELETE from user_entity WHERE user_id = $1 RETURNING *`, [userId]);
    if (!deleteUser.length) throw new httpException(409, "User not found");
    return deleteUser[0];
  }
}
