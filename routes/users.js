const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

const users = require('../controllers/users');


const catchAsync = require('../utils/catchAsync');

// Register
router.get('/register',users.renderRegister);

router.post('/register',catchAsync(users.registerUser));

// Login

router.get('/login',users.renderLoginForm);

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login);
// logout 

router.get('/logout',(req, res)=>{
    req.logout();
    req.flash('success','Successfully logout')
    res.redirect('/campgrounds');
})
module.exports = router;