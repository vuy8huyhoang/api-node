var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var transporter = require('../utils/mailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// Hàm tạo token ngẫu nhiên
const generateToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, generateToken(), { expiresIn: '1m' }); // expires in 1 minute
    const refreshToken = jwt.sign({ userId }, generateToken(), { expiresIn: '30d' }); // expires in 30 days

    return { accessToken, refreshToken };
};


router.post('/', async (req, res) => {
    try {
        const { email, mat_khau } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 400, message: 'Người dùng không tồn tại!' });
        }

        const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
        if (!isMatch) {
            return res.status(401).json({ status: 401, message: 'Mật khẩu không chính xác!' });
        }

        if (!user.xac_minh) {
            return res.status(403).json({ status: 403, message: 'Vui lòng xác minh email của bạn trước khi đăng nhập!' });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 60 * 1000 }); // 1 phút
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 ngày

        res.status(200).json({ status:200,message: 'Đăng nhập thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
});


module.exports = router;
