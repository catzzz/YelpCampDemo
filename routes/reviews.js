const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {reviewSchema } = require('../schemas');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');




router.post('/',isLoggedIn, validateReview,catchAsync(reviews.createAReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async (req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews:reviewId } } );
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully delete a review!!!!');
    res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;
