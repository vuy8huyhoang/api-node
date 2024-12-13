var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport2 = require('../passport/passport');
var User = require('../models/user');
const generateToken = () => {
    return crypto.randomBytes(64).toString('hex');
};
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, generateToken(), { expiresIn: '1m' }); // expires in 1 minute
    const refreshToken = jwt.sign({ userId }, generateToken(), { expiresIn: '30d' }); // expires in 30 days

    return { accessToken, refreshToken };
};
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 60 * 1000 }
}));
router.use(passport2.initialize());
router.use(passport2.session());


router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']  // Lấy thông tin profile và email từ Google
    })
);

// Google callback URL sau khi đăng nhập thành công
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            const user = req.user; 
            const { accessToken, refreshToken } = generateTokens(user._id);
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: 60 * 1000,
                secure: process.env.NODE_ENV === 'production'
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production'
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
);


router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);  // Nếu có lỗi trong logout, trả lỗi
        }

        // Xóa session
        req.session.destroy(function (err) {
            if (err) {
                return next(err);  // Nếu có lỗi khi xóa session, trả lỗi
            }

            // Xóa cookies (accessToken và refreshToken)
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.clearCookie('connect.sid');  // Xóa cookie session mặc định của Express

            const googleLogoutUrl = 'https://accounts.google.com/Logout';  // URL logout của Google
            res.redirect(googleLogoutUrl);  

            // Sau khi đăng xuất Google, redirect về trang chủ (hoặc trang khác)
            res.redirect('/'); 
        });
    });
});


module.exports = router;
