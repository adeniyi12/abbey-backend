import { Repository } from "typeorm";
import { FeedEntity } from "../entities/feed.entity";
import { Feed } from "../interface/feed.interface";
import { AppDataSource } from "../database";

export class FeedService extends Repository<FeedEntity> {
  public async createFeed(feed: Feed): Promise<Feed> {
    const query = `INSERT INTO public.feed_entity(title, description, "imageUrl", category, user_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const createdFeed: Feed[] = await AppDataSource.query(query, [feed.title, feed.description, feed.imageUrl, feed.category, feed.user_id]);
    return createdFeed[0];
  }

  public async getFeeds(): Promise<Feed[]> {
    return await AppDataSource.query(`SELECT f.*, u.user_id as user_id, u.first_name as user_first_name, u.last_name as user_last_name, u.profile_picture as user_profile_picture, u.location as user_location from feed_entity f JOIN user_entity u ON f.user_id = u.user_id`);
  }
}
