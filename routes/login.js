var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var transporter = require('../utils/mailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const generateToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, generateToken(), { expiresIn: '1m' }); // expires in 1 minute
    const refreshToken = jwt.sign({ userId }, generateToken(), { expiresIn: '30d' }); // expires in 30 days

    return { accessToken, refreshToken };
};
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
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 60 * 1000
    }
}));

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
        const otp = generateOTP(); // Tạo mã OTP ngẫu nhiên (6 ký tự)
        const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

        // Cập nhật mã OTP và thời gian hết hạn vào cơ sở dữ liệu
        user.otp = otp;
        user.otp_expiration = otpExpiration;
        await user.save();
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
                <div class="email-header">
                    <h1>Chào mừng bạn!</h1>
                </div>
                <div class="email-body">
                    <h2>Xác minh email của bạn</h2>
                    <p>Cảm ơn bạn đã đăng ký tài khoản trên hệ thống của chúng tôi. Để hoàn tất việc đăng ký, vui lòng nhập mã OTP dưới đây:</p>
                    <div class="otp-box">${otp}</div>
                    <p><strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau 5 phút. Nếu bạn không yêu cầu mã này, hãy bỏ qua email.</p>
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
        if (!user.xac_minh) {
            try {
                if (!mailOptions) {
                    console.error("mailOptions is undefined!"); // Ghi log lỗi
                    return res.status(500).json({ status: 500, message: 'Lỗi hệ thống. Vui lòng thử lại sau!' });
                }

                await sendEmail(mailOptions);
                return res.status(403).json({ status: 403, message: 'Vui lòng xác minh email của bạn trước khi đăng nhập!' });
            } catch (error) {
                console.error("Error sending email:", error); // Ghi log lỗi chi tiết
                return res.status(500).json({ status: 500, message: 'Lỗi gửi email xác minh. Vui lòng thử lại sau!' });
            }
        }

        const { accessToken, refreshToken } = generateTokens(user._id);
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 60 * 1000,
            secure: process.env.NODE_ENV === 'production'
        }); // 1 phút
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production'
        }); // 30 ngày

        res.status(200).json({ status:200,message: 'Đăng nhập thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
});


module.exports = router;
