import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../models/index.js";

passport.use(
    new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/api/facebook/callback",
      profileFields: ["id", "emails", "name"], // lấy email, tên (Facebook không hỗ trợ phone trong profileFields)
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const facebookId = profile.id;
        const fullName = `${profile.name.givenName} ${profile.name.familyName}`;
        // Facebook không cung cấp số điện thoại trong profileFields cơ bản
        // User có thể cập nhật số điện thoại sau khi đăng ký

        let user = await User.findOne({ where: { provider_id: facebookId, provider: "facebook" } });

        // Nếu chưa có user -> tạo mới
        if (!user) {
          // Kiểm tra nếu email đã tồn tại cho tài khoản local thì KHÔNG liên kết
          const existingUser = await User.findOne({ where: { email, provider: "local" } });
          if (existingUser) {
            return done(null, false, { message: "Email này đã được dùng cho tài khoản local" });
          }

          user = await User.create({
            email,
            full_name: fullName,
            phone: null, // Số điện thoại sẽ được cập nhật sau khi đăng ký
            provider: "facebook",
            provider_id: facebookId,
            access_token: accessToken,
            refresh_token: refreshToken
          });
        } else {
          // Cập nhật lại accessToken nếu cần
          user.access_token = accessToken;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
)