var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: "Gmail",
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS, 
    }
});

module.exports = transporter;
