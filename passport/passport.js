const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); 
require('dotenv').config();

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const clientid = process.env.GOOGLE_CLIENT_ID;
const clientsecret = process.env.GOOGLE_CLIENT_SECRET;
const callback = process.env.GOOGLE_CALLBACK_URL;

passport.use(new GoogleStrategy({
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: callback,
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (!existingUser) {
            // Tạo mới user nếu chưa tồn tại
            const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
                // Các trường khác tùy theo model của bạn
            });
            await newUser.save();
            return done(null, newUser);
        } else {
            // Nếu user đã tồn tại, kiểm tra xem đã liên kết với Google chưa
            if (!existingUser.googleId) {
                // Cập nhật thông tin Google cho user
                existingUser.googleId = profile.id;
                existingUser.name = profile.displayName;
                existingUser.image = profile.photos[0].value;
                await existingUser.save();
            } else {
                // Nếu user đã liên kết với Google, thông báo lỗi
                return done(null, false, { message: 'Email này đã được liên kết với một tài khoản Google khác' });
            }
        }

        return done(null, existingUser);
    } catch (err) {
        console.error('Lỗi khi xác thực bằng Google:', err);
        return done(err);
    }
}));


module.exports = passport;
