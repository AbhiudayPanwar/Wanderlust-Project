const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // require service
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });       // made a client to use service with map token

module.exports.index = async (req,res)=>{  // don't use app as we don't have acess to it
    let allListings = await Listing.find();
    res.render('listings/index.ejs',{allListings});
    };

module.exports.newForm = (req,res)=>{
    res.render('listings/new.ejs');
};
module.exports.showListing = async (req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id).populate({path : "reviews", populate :{path : "author"}}).populate("owner");
    if(! listing){
        req.flash("error","Listing you searched for does not Exist");
        res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listing});
    };    
module.exports.newPost = async (req,res,next)=>{
    // let result = listingSchema.validate(req.body);
    // console.log(result);
        let response = await geocodingClient
        .forwardGeocode({
            query:req.body.listing.location,
            limit: 1,
        })
        .send();
        console.log(response.body.features[0].geometry);
        let url,filename;
        if(req.file){
        url  = req.file.path;
        filename = req.file.filename;
        console.log(req.file);
        }  
    const list = req.body.listing;          // listing stores data as object
    const newListing = await Listing(list);
    newListing.owner = req.user._id;
    if(req.file) {
        newListing.image = { url,filename };
    }
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","Listing is Created");
    res.redirect('/listings');
};    
module.exports.editForm =async (req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{ listing });
};
module.exports.editPost = async (req,res,next)=>{
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    const list = req.body.listing;
    let { id }= req.params; 
    let reqList = await Listing.findByIdAndUpdate(id, list);
    // It will check if id is present or not
      if(! reqList){
        req.flash("error","Listing you searched for does not Exist");
        res.redirect('/listings');
     }
     if(req.file){
        const url  = req.file.path;
        let filename = req.file.filename;
        console.log(req.file);
        reqList.image = {url,filename};
        await reqList.save();
        }  
    req.flash("success","Listing is Edited");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted");
    res.redirect('/listings');
};