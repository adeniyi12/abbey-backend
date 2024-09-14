import { AppDataSource } from "../database";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../entities/users.entity";
import { Request, Response, NextFunction } from "express";
import { User } from "../interface/users.interface";

export class AuthController {
  public auth = new AuthService(UserEntity, AppDataSource.manager);

  public Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { cookie, findUser } = await this.auth.login(userData);
      res.status(200).json({ status: 200, message: "login successful", data: findUser, token: cookie });
    } catch (error) {
      next(error);
    }
  };
}
