var express = require('express');
var router = express.Router();
var transporter = require('../utils/mailer');
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/gui', (req, res) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'vuy8huyhoang@gmail.com',
        subject: 'Test Email from NodeMailer',
        text: 'This is a test email sent from NodeMailer!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error: ' + error);
            return res.status(500).send('Failed to send email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
    });
});

module.exports = router;
