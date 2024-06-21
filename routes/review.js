const express = require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const Review=require('../models/review.js');
const Listing=require('../models/listing.js');
const {validateReview, isLoggedIn, isReviewOwner}=require('../middleware.js')
const reviewController=require('../controllers/reviews.js')

//Reviews
//add new review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewController.deleteRoute));


module.exports=router