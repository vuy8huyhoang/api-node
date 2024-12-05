var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS, 
    }
});

module.exports = transporter;
