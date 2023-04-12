 const Review = require('../models/review')
 const Campground = require('../models/campground')
module.exports.createReview = async (req,res)=>{
    const campground= await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.review.push(review);
    await campground.save();
    await review.save();
    req.flash('success','created a new review')
    res.redirect(`/campgrounds/${req.params.id}`)
  }

  module.exports.deleteReview = async(req,res)=>{
    await Campground.findOneAndUpdate(req.params.id,{$pull:{review:req.params.reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','successfully deleted review')
    res.redirect(`/campgrounds/${req.params.id}`)
};