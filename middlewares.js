const expressError = require('./utilis/expressError.js');
const { listingSchema,reviewSchema } = require('./schema.js');
const Listing  = require('./models/listing.js');
const Review  = require('./models/review.js');

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.reUrl = req.originalUrl;
        req.flash("error","You must be Logged In");
        res.redirect("/login");
    }
    else {
        next();
    }
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    res.locals.reUrl = req.session.reUrl || "/listings";
    next();
};
module.exports.isOwner = async(req,res,next)=>{
    let{id}=req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currentUser._id.equals(listing.owner)){
        return next();
    }
    else {
        req.flash("error","you don't have perssion to perform the action");
        res.redirect(`/listings/${id}`);
    }

}
module.exports.isAuthor = async(req,res,next)=>{
    let{id,rid}=req.params;
    let review = await Review.findById(rid);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you can't perform this operation");
        res.redirect(`/listings/${id}`);
    }
    else{
        next();
    }
}

module.exports.validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if(error){
      errMsg = error.details.map((el)=>el.message).join(',');  
      throw new expressError(400,errMsg);
    }
    else 
    {
        next() ;
    }
    
};
module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
      errMsg = error.details.map((el)=>el.message).join(',');  
      throw new expressError(400,errMsg);
    }
    else 
    {
        next() ;
    }
    
};