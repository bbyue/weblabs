import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { User} from "../models/user.js";
import dotenv from "dotenv";

dotenv.config;
const options ={
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(options, async (payload, done) =>{
        try {
            const user = await User.findByPk(payload.sub);
            if (user){
                return done(null, user);
            }
            return done(null, false);
        }catch (error){
            return done(error, false);
        }        
    })
);