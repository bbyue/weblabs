import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET не найден в переменных окружения');
}
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findByPk(payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
}));
