var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var transporter = require('../../utils/mailer');
var crypto = require('crypto');


// Route để xác minh email
router.post('/', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Kiểm tra xem email có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: 'Không tìm thấy email!' });
        }

        // Kiểm tra OTP đã hết hạn chưa
        if (user.otp_expiration < Date.now()) {
            return res.status(400).json({ status: 400, message: 'Mã OTP đã hết hạn!' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ status: 400, message: 'Mã OTP không chính xác!' });
        }

        // Cập nhật trạng thái xac_minh của người dùng thành true
        user.xac_minh = true;
        user.otp = null;  // Xóa mã OTP sau khi xác minh thành công
        user.otp_expiration = null;  // Xóa thời gian hết hạn của OTP

        await user.save();

        return res.status(200).json({ status: 200, message: 'Xác minh thành công!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: 'Có lỗi xảy ra. Vui lòng thử lại!' });
    }
});

module.exports = router;
