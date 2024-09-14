import { Repository } from "typeorm";
import { RelationshipEntity } from "../entities/relationship.entity";
import { Relationship } from "../interface/relationship.interface";


export class RelationshipService extends Repository<RelationshipEntity> {

    public async followUser(relationship: Relationship): Promise<Relationship> {
        const query = `INSERT INTO public.relationship_entity(user_id, friend_id)
            VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`;
        const createdRelationship: Relationship[] = await RelationshipEntity.query(query, [relationship.user_id, relationship.friend_id]);
        return createdRelationship[0];
    }

    public async unfollowUser(relationship: Relationship): Promise<Relationship> {
        const query = `DELETE FROM public.relationship_entity WHERE user_id = $1 AND friend_id = $2 RETURNING *`;
        const createdRelationship: Relationship[] = await RelationshipEntity.query(query, [relationship.user_id, relationship.friend_id]);
        return createdRelationship[0];
    }

    public async getRelationships(userId: string, type: string): Promise<Relationship[]> {
        const query = type === 'followers' ? `SELECT u.user_id, u.first_name, u.last_name, u.profile_picture FROM public.user_entity u JOIN public.relationship_entity r ON u.user_id = r.user_id WHERE r.friend_id = $1`:
        type === 'following' ? `SELECT u.user_id, u.first_name, u.last_name, u.profile_picture FROM public.user_entity u JOIN public.relationship_entity r ON u.user_id = r.friend_id WHERE r.user_id = $1`:
        `SELECT u.user_id, u.first_name, u.last_name, u.profile_picture FROM public.user_entity u WHERE u.user_id IN (SELECT r1.friend_id FROM public.relationship_entity r1
        JOIN public.relationship_entity r2 ON r1.friend_id = r2.user_id WHERE r1.user_id = $1 AND r2.friend_id = $1)`;

        const relationships: Relationship[] = await RelationshipEntity.query(query, [userId]);
        return relationships;
    }
}