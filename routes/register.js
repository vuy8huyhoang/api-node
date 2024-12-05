var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var transporter = require('../utils/mailer');

// Hàm tạo mã OTP 6 chữ số
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

router.post('/', async (req, res) => {
    try {
        const { email, mat_khau } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status:400,message: 'Email đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mat_khau, salt);

        // Tạo mã OTP và tính thời gian hết hạn
        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 1 * 60 * 1000); // 1 phút sau hiện tại

        // Tạo người dùng mới
        const newUser = new User({
            email,
            mat_khau: hashedPassword,
            role: 0,
            xac_minh: false,
            otp: otp,
            otp_expiration: otpExpiration
        });

        await newUser.save(); // Lưu vào cơ sở dữ liệu

        // Gửi email chứa OTP
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mã OTP xác minh email',
            text: `Mã OTP của bạn là: ${otp}. OTP sẽ hết hạn sau 1 phút.`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(501).json({status:501, message: 'Không thể gửi email OTP.' });
            }
            console.log('Email đã được gửi: ' + info.response);
        });

        res.status(201).json({
            status: 201,
            message: 'Đăng ký thành công! Mã OTP đã được gửi đến email của bạn.',
            user: { email: newUser.email, role: newUser.role, xac_minh: newUser.xac_minh }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: 'Có lỗi xảy ra. Vui lòng thử lại!' });
    }
});

module.exports = router;
