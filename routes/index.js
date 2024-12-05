var express = require('express');
var router = express.Router();
const User = require('../models/user');

const newUser = new User({
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 30,
});
newUser.save()
    .then((user) => {
        console.log('User saved:', user);
    })
    .catch((err) => {
        console.error('Error saving user:', err);
    });
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
