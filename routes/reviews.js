const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground')
const {reviewSchema} = require('../schemas');

const Review = require('../models/review');
// ------------------------- VALIDATION FOR REVIEW SHCEMA--------------------
const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
    
}


// ------------------ ROUTES FOR REVIEW -------------------------------------


router.post('/',validateReview, catchAsync(async(req,res) =>
{   
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    // res.send("yay")
    req.flash("Success", "Created a new review")
    res.redirect(`/campgrounds/${campground._id}`);

}));

router.delete('/:reviewId', catchAsync(async(req,res)=>{
    const{id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Deleted a review")
    res.redirect(`/campgrounds/${id}`)
})); 

module.exports = router;