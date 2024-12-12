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
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callback = process.env.GOOGLE_CALLBACK_URL;

passport.use(new GoogleStrategy({
    clientID: clientid, 
    clientSecret: clientSecret, 
    callbackURL: callback,
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Tìm user dựa trên Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Nếu không tìm thấy user, tạo mới user
            user = new User({
                google_id: profile.id,
                ten: profile.displayName,
                email: profile.emails[0].value,  // Lấy email từ profile
                hinh: profile.photos[0].value,  // Lấy hình ảnh từ profile
                xac_minh:true
            });

            // Lưu thông tin người dùng mới vào cơ sở dữ liệu
            await user.save();
        }

        // Gọi callback và trả về đối tượng người dùng
        done(null, user);
    } catch (err) {
        // Nếu có lỗi, gọi callback với lỗi
        done(err, null);
    }
}));


module.exports = passport;
