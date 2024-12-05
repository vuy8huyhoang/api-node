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
            subject: 'Xác minh email - Mã OTP của bạn',
            html: `
    <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    background-color: #4CAF50;
                    padding: 20px;
                    text-align: center;
                    color: #ffffff;
                }
                .email-header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .email-body {
                    padding: 20px;
                }
                .email-body h2 {
                    margin: 0 0 10px 0;
                    font-size: 20px;
                    color: #4CAF50;
                }
                .email-body p {
                    margin: 10px 0;
                    line-height: 1.6;
                }
                .otp-box {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    font-size: 24px;
                    font-weight: bold;
                    color: #4CAF50;
                    background-color: #f1f8e9;
                    border: 1px dashed #4CAF50;
                    border-radius: 5px;
                    letter-spacing: 2px;
                }
                .email-footer {
                    background-color: #f1f1f1;
                    padding: 15px;
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                }
                .email-footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #4CAF50;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #43a047;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
            <img src="/logo-aitech.png" alt="logo"/>
                <div class="email-header">
                    <h1>Chào mừng bạn!</h1>
                </div>
                <div class="email-body">
                    <h2>Xác minh email của bạn</h2>
                    <p>Cảm ơn bạn đã đăng ký tài khoản trên hệ thống của chúng tôi. Để hoàn tất việc đăng ký, vui lòng nhập mã OTP dưới đây:</p>
                    <div class="otp-box">${otp}</div>
                    <p><strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau 1 phút. Nếu bạn không yêu cầu mã này, hãy bỏ qua email.</p>
                </div>
                 <div class="email-footer">
                    <p>Bạn nhận được email này vì đã sử dụng địa chỉ email để đăng ký tài khoản trên hệ thống của chúng tôi.</p>
                    <p>Nếu bạn gặp vấn đề, vui lòng liên hệ với chúng tôi qua số điện thoại: <strong><a href="tel:+8429008316">0829008316</a></strong> hoặc qua email: <strong><a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></strong>.</p>
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
