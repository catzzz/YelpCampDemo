const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const {isLoggedIn,isAuthor, validateCampground } = require('../middleware');






router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,validateCampground ,catchAsync(campgrounds.createCampground));


router.get('/new',isLoggedIn, campgrounds.renderNewForm); // this has to be in front of /:id otherwise the node treat it as id



router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,validateCampground , catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));


router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEdit));


module.exports = router;