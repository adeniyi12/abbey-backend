import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRoute {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/login", this.auth.Login);
    this.router.get("/refresh", this.auth.refresh);
    this.router.post("/google-login", this.auth.googleLogin);
  }
}
