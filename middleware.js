const Listing=require('./models/listing.js');
const Review=require('./models/review.js');
const {listingSchema,reviewSchema}=require('./schema.js')
const ExpressError=require('./utils/ExpressError.js')

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error","you must be logged in to create new listing");
        return res.redirect('/login');
    }
    next();
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
}

//For Listing
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!(listing.owner._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//for Review
module.exports.isReviewOwner=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!(review.author.equals(res.locals.currUser._id))){
        req.flash("error","You are not owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}