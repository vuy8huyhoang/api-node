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


var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');

app.set('port', port);





app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);


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
    console.log(`Server đang chạy ở cổng  http:localhost:${port}`);
});
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Đã kết nối database MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });
module.exports = app;
