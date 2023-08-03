const Review = require('../models/review');
const Campground = require('../models/campground')

module.exports.NewReview = async(req,res) =>
{   
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    // res.send("yay")
    req.flash("Success", "Created a new review")
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.DeleteReview = async(req,res)=>{
    const{id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Deleted a review")
    res.redirect(`/campgrounds/${id}`)
}
