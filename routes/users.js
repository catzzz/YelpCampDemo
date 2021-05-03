const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

// Register
router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync(async(req,res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registerUser = await User.register(user, password);
        req.login(registerUser,err =>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to YelCamp');
            res.redirect('/campgrounds');
        });
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
}));

// Login

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res) => {
    req.flash('success','welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
});
// logout 

router.get('/logout',(req, res)=>{
    req.logout();
    req.flash('success','Successfully logout')
    res.redirect('/campgrounds');
})
module.exports = router;