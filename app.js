
// store api key with .env
f (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


// routes
const userRoute = require('./routes/users');
const campgroundRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');

const Joi = require('joi');
const {campgroundSchema ,reviewSchema} = require('./schemas');


const { slice } = require('./seeds/cities');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));





app.use(express.static(path.join(__dirname, 'public')))



const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig));
app.use(flash());


// Passport setting

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // serialize -> save user in session
passport.deserializeUser(User.deserializeUser());// deserialize -> get user out of session



app.use((req, res, next )=>{
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes

app.use('/',userRoute);
app.use('/campgrounds',campgroundRoute);
app.use('/campgrounds/:id/reviews',reviewRoute);



app.get('/',(req,res)=>{
    res.render('home');
});


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found', 404))
});
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});


app.listen(3000, () => {
    console.log("LISTEN PORT 3000");
});