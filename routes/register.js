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
            html: `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f9;
                }
                .email-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #4CAF50;
                }
                .content {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333333;
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    color: #FF5722;
                    background-color: #f7f7f7;
                    padding: 10px;
                    border-radius: 4px;
                    margin: 20px 0;
                    display: inline-block;
                }
                .footer {
                    text-align: center;
                    padding-top: 20px;
                    font-size: 14px;
                    color: #777777;
                }
                .footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Xác minh email của bạn</h1>
                </div>
                <div class="content">
                    <p>Chào bạn,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản trên hệ thống của chúng tôi.</p>
                    <p>Để hoàn tất quá trình đăng ký, vui lòng nhập mã OTP sau:</p>
                    <div class="otp">${otp}</div>
                    <p>Mã OTP sẽ hết hạn sau 1 phút, vui lòng sử dụng ngay.</p>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ hỗ trợ của chúng tôi</p>
                </div>
                <div class="footer">
                    <p>Bạn nhận được email này vì đã đăng ký tài khoản trên website của chúng tôi. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                    <p><a href="#">Xem thêm chi tiết về chính sách bảo mật</a></p>
                </div>
            </div>
        </body>
    </html>
    `,
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
