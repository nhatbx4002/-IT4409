import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {User} from "../models/index.js";
import { loadEnv } from "./env.js";
import { APP_CONSTANTS } from "./constants.js";

const env = loadEnv();

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: APP_CONSTANTS.oauth.googleCallbackUrl,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleEmail = profile.emails[0].value;

                //kiem tra user da ton tai hay chua
                let user = await User.findOne({ where: { provider_id: profile.id }});

                //Neu chua co user google -> kiem tra email trung
                if(!user){
                    const existingEmailUser = await User.findOne({ where : { email: googleEmail} });

                    if(existingEmailUser){
                        //Neu trung email tu choi dang nhap banmg google
                        return done(
                            null,
                            false,
                            { message : "Email nay da ton tai. Vui long dang nhap bang phuong thuc khac"}
                        );
                    }

                    //Neu chua co user nao thi tao tai khoan moi
                    user = await User.create({
                        full_name: profile.displayName,
                        email: googleEmail,
                        provider: "google",
                        provider_id: profile.id,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                } else {
                    // Neu da co user thi cap nhat token moi
                    user.access_token = accessToken;
                    user.refresh_token = refreshToken;
                    await user.save();
                }
                return done(null, user);
            }catch(error){
                console.error("Loi khi dang nhap", error);
                return done(error, null);
                
            }
        }
    )
)

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
})