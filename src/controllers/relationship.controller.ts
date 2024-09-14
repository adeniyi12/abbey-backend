import { AppDataSource } from "../database";
import { RelationshipEntity } from "../entities/relationship.entity";
import { RelationshipService } from "../services/relationship.service";
import { Request, Response, NextFunction } from "express";
import { Relationship } from "../interface/relationship.interface";
import { RequestWithUser } from "../interface/auth.interface";

export class RelationshipController {
  public relationship = new RelationshipService(RelationshipEntity, AppDataSource.manager);

  public followUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string | undefined = String(req.user?.user_id);
      const relationship: Relationship = { user_id: userId, friend_id: req.params.id };
      const createdRelationship: Relationship = await this.relationship.followUser(relationship);
      res.status(201).json({ status: 201, message: "User followed successfully", data: createdRelationship});
    } catch (error) {
      next(error);
    }
  };

  public unfollowUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string | undefined = String(req.user?.user_id);
      const relationship: Relationship = { user_id: userId, friend_id: req.params.id };
      const createdRelationship: Relationship = await this.relationship.unfollowUser(relationship);
      res.status(200).json({ status: 200, message: "User unfollowed", data: createdRelationship });
    } catch (error) {
      next(error);
    }
  };

  public getRelationships = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string | undefined = String(req.user?.user_id);
      const type = req.query.type as "followers" | "following" | "friends";
      const relationships: Relationship[] = await this.relationship.getRelationships(userId, type);
      res.status(200).json({ status: 200, message: "User relationships", data: relationships });
    } catch (error) {
      next(error);
    }
  };
}
