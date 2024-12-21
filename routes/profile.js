var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user'); // Giả sử bạn có model User
const cookieParser = require('cookie-parser');
router.use(cookieParser())
// Middleware để xác thực accessToken
const authenticateToken = async (req, res, next) => {
    const token = req.cookies.accessToken; 

    if (!token) {
        return res.status(401).json({ status: 401, message: 'Không có accessToken. Vui lòng đăng nhập lại.' });
    }

    try {
        // Kiểm tra xem token có hợp lệ trong cơ sở dữ liệu không
        const user = await User.findOne({ accessToken: token });

        if (!user) {
            return res.status(403).json({ status: 403, message: 'Token không hợp lệ.' });
        }

        // Nếu token hợp lệ, thêm userId vào request
        req.userId = user._id;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: 'Có lỗi xảy ra khi xác thực token.' });
    }
};


// Route để lấy thông tin profile người dùng
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Dùng userId từ token đã xác thực
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: 'Người dùng không tồn tại.' });
        }

        // Trả về thông tin profile người dùng (bạn có thể chọn trả về thông tin nào)
        res.status(200).json({
            status: 200,
            message: 'Lấy thông tin thành công.',
            profile: {
                id:user._id,
                ten: user.ten,
                email: user.email,
                hinh:user.hinh,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
});

module.exports = router;
