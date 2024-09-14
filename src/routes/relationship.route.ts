import { Router } from "express";
import { RelationshipController } from "../controllers/relationship.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class RelationshipRoute {
    public router = Router();
    public relationship = new RelationshipController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/follow/:id", AuthMiddleware, this.relationship.followUser);
        this.router.post("/unfollow/:id", AuthMiddleware, this.relationship.unfollowUser);
        this.router.get("/relationships", AuthMiddleware, this.relationship.getRelationships);
    }
}