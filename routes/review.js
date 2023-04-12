const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync.js');
const Review = require('../models/review.js');
const Campground = require('../models/campground.js')
const ExpressError = require('../utils/ExpressError.js');
const methodOverride = require('method-override');
const {campgroundSchema} = require('../views/schema.js')
const {reviewSchema} = require('../views/schema.js')
const {validateReviewData}=require('../middleware')
const {isLoggedIn,isReviewAuthor} = require('../middleware')
const review = require('../controllers/reviews');
router.post('/',isLoggedIn,validateReviewData,catchAsync(review.createReview))
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview))

  module.exports = router;