const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

const users = require('../controllers/users');


const catchAsync = require('../utils/catchAsync');

// Register
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser));

// Login
router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login);
// logout 

router.get('/logout',users.logout);
module.exports = router;