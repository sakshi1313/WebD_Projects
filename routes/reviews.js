const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground')
const {reviewSchema} = require('../schemas');
const {isLoggedIn, isAuthor, validateCampground, validateReview, isReviewAuthor} = require("../middleware");
const Review = require('../models/review');
// ------------------------- VALIDATION FOR REVIEW SHCEMA..NOW MOVED TO MIDDLEWARES--------------------

const reviews = require('../controllers/reviews')

// ------------------ ROUTES FOR REVIEW -------------------------------------


router.post('/',isLoggedIn,validateReview, catchAsync(reviews.NewReview))

router.delete('/:reviewId',isReviewAuthor, isLoggedIn, catchAsync(reviews.DeleteReview))

module.exports = router;




