import { AppDataSource } from "../database";
import { FeedEntity } from "../entities/feed.entity";
import { FeedService } from "../services/feed.service";
import { Request, Response, NextFunction } from "express";

export class FeedController {
  public feed = new FeedService(FeedEntity, AppDataSource.manager);

  public createFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const feed = req.body;
      const createdFeed = await this.feed.createFeed(feed);
      res.status(201).json({ status: 201, message: "feed created", data: createdFeed });
    } catch (error) {
      next(error);
    }
  };

  public getFeeds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const feeds = await this.feed.getFeeds();
      res.status(200).json({ status: 200, message: "data retrieved successfully", data: feeds });
    } catch (error) {
      next(error);
    }
  };
}
