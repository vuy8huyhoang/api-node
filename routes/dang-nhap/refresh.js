const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
var User = require('../../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

router.use(cookieParser());
const generateToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, generateToken(), { expiresIn: '1m' }); // expires in 1 minute
    const refreshToken = generateToken(); // refresh token ngẫu nhiên
    return { accessToken, refreshToken };
};
router.post('/', async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(403).json({ message: 'Không có refresh token trong cookie!' });
        }

        // Kiểm tra tính hợp lệ của refresh token
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc hết hạn!' });
        }

        // Tạo access token mới
        const { accessToken } = generateTokens(user._id);

        // Cập nhật lại cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 60 * 1000 }); // 1 phút

        return res.status(200).json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi làm mới token!' });
    }
});
module.exports = router;
