var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config();
var app = express();
var http = require('http');
var port = process.env.PORT || 4000;
var server = http.createServer(app);
const mongoose = require('mongoose');
const mongoURI = process.env.DB_URL;
const cors = require('cors');


var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var verifyRouter = require('./routes/verify');
var resendRouter = require('./routes/resend-verify');
var loginRouter = require('./routes/login');
var refreshRouter = require('./routes/refresh');
var authRouter = require('./routes/auth');
var chatRouter = require('./routes/chat');
var profileRouter=require('./routes/profile')


app.use(cors({
    origin: '*', // Cho phép tất cả các miền (có thể thay đổi cho phù hợp)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Các phương thức cho phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các headers cho phép
    credentials: true,
}));

app.set('port', port);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));







app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/verify', verifyRouter);
app.use('/resend-verify', resendRouter);
app.use('/login', loginRouter);
app.use('/refresh', refreshRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/profile', profileRouter);


app.use(function (req, res, next) {
    next(createError(404));
});




app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});
server.listen(port, function () {
    console.log(`Server đang chạy ở cổng  http://localhost:${port}`);
});
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Đã kết nối database MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });
module.exports = app;
