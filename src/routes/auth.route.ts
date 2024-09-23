import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import passport from "passport";
import PassportAuth from '../middlewares/passport.middleware'


export class AuthRoute {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (req, res) => {
      res.send('<a href="/google-login">Authenticate with google</a>')
    })
    this.router.post("/login", this.auth.Login);
    this.router.get("/refresh", this.auth.refresh);
    this.router.get("/google-login", passport.authenticate('google', { scope: ['profile', 'email'] }));
    
    this.router.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/login',
      })
    );

  }
}
