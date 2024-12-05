var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var transporter = require('../utils/mailer');

// Hàm tạo mã OTP 6 chữ số
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}
const sendEmail = async (mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
};

router.post('/', async (req, res) => {
    try {
        const { email, mat_khau } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: 'Email đã tồn tại!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mat_khau, salt);

        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 1 * 60 * 1000); // 1 phút sau hiện tại

        const newUser = new User({
            email,
            mat_khau: hashedPassword,
            role: 0,
            xac_minh: false,
            otp,
            otp_expiration: otpExpiration,
        });

        await newUser.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mã OTP xác minh email',
            text: `Mã OTP của bạn là: ${otp}. OTP sẽ hết hạn sau 1 phút.`,
        };

        await sendEmail(mailOptions);

        res.status(201).json({
            status: 201,
            message: 'Đăng ký thành công! Mã OTP đã được gửi đến email của bạn.',
            user: { email: newUser.email, role: newUser.role, xac_minh: newUser.xac_minh },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: 'Có lỗi xảy ra. Vui lòng thử lại!' });
    }

});

module.exports = router;
