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
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Nếu sử dụng HTTPS, đặt `secure: true`
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
    (req, res) => {
        res.redirect('/');
    }
);


module.exports = router;
