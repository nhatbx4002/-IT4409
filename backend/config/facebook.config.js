import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:3000/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const facebookId = profile.id;
        
        // Kiểm tra email có tồn tại không
        if (!email) {
          return done(
            null,
            false,
            { message: "Facebook account không có email. Vui lòng cung cấp email trong cài đặt Facebook." }
          );
        }

        // Xử lý fullName an toàn
        const givenName = profile.name?.givenName || "";
        const familyName = profile.name?.familyName || "";
        const fullName = `${givenName} ${familyName}`.trim() || profile.displayName || "Facebook User";

        let user = await User.findOne({ 
          where: { provider_id: facebookId, provider: "facebook" } 
        });

        if (!user) {
          // Kiểm tra email đã tồn tại
          const existingUser = await User.findOne({ 
            where: { email, provider: "local" } 
          });
          
          if (existingUser) {
            return done(
              null,
              false,
              { message: "Email này đã được dùng cho tài khoản local" }
            );
          }

          user = await User.create({
            email,
            full_name: fullName,
            phone: null,
            provider: "facebook",
            provider_id: facebookId,
            access_token: accessToken,
            refresh_token: refreshToken || null
          });
        } else {
          // Cập nhật cả access_token và refresh_token
          user.access_token = accessToken;
          if (refreshToken) {
            user.refresh_token = refreshToken;
          }
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("Facebook OAuth error:", err);
        done(err, null);
      }
    }
  )
);