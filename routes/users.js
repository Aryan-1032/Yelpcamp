const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const user=require('../controllers/users');

router.route('/register')
        .get (user.renderRegisterForm)
        .post(catchAsync(user.createUser));

router.route('/login')
    .get(user.renderLoginForm)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo: true }),user.login);

    router.get('/logout',user.logout);
module.exports = router;