
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config";
import { UserService } from "../services/user.service";
import { UserEntity } from "../entities/users.entity";
import { User } from "../interface/users.interface";
import { httpException } from "../exceptions/httpException";


import { AppDataSource } from "../database";

class PassportAuth {
    constructor () {
        this.initializeGoogleStrategy()
    }

    private initializeGoogleStrategy() {
        passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID as string,
            clientSecret: GOOGLE_CLIENT_SECRET as string,
            callbackURL: "http://localhost:3000/auth/google/callback",
            scope: ['profile', 'email']
          },
          async (accessToken: string, refreshToken: string, profile: Profile,  cb: (error: any, user?: any) => void) => {
            const email = profile.emails && profile.emails[0]?.value;
            const profile_picture = profile.photos && profile.photos[0]?.value;
            const findUser: User | null = await UserEntity.findOne({ where: { email: email } });
            if (findUser) { 
                const query = `SELECT * from user_entity WHERE email = $1`;
                const user: User[] = await AppDataSource.query(query, [email]);
                return user[0];
            } else {
                const query = `INSERT INTO public.user_entity(
                    user_id, first_name, last_name, email, profile_picture)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
                    const createdUser: User[] = await AppDataSource.query(query, [
                        'usr-' + Math.floor(1000 + Math.random() * 9000),
                        profile.name?.givenName,
                        profile.name?.familyName,
                        email,
                        profile_picture
                      ]);
                      return createdUser[0];
            }
        }
        ));
        passport.serializeUser((user, done) => {
            done(null, user)
        })
        
        passport.deserializeUser((user, done)=> {
            done(null
        
            )
        })
    }

    public initialize() {
        return passport.initialize()
    }

    public session() {
        return passport.session();
    }

    public ensureAuthenticated(req: any, res: any, next: any) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.redirect('/login');
      }
}

export default new PassportAuth()