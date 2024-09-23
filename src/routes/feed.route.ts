import { Router } from "express";
import { FeedController } from "../controllers/feed.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class FeedRoute {
  public path = "/feed";
  public router = Router();
  public feed = new FeedController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(`${this.path}`, passport.ensureAuthenticated(), this.feed.getFeeds);
    // this.router.post(`${this.path}`, AuthMiddleware, this.feed.createFeed);
  }
}
