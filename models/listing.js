const mongoose = require('mongoose');
const Review = require('./review');
const { ref } = require('joi');
const listSchema = new mongoose.Schema({
    title : { 
        type : String,
        required: true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        url : {
            type : String,
            default: 'https://unsplash.com/photos/a-narrow-city-street-with-buildings-on-both-sides-NUAGekkp2xo',
            set : (v)=> v===""?'https://unsplash.com/photos/a-narrow-city-street-with-buildings-on-both-sides-NUAGekkp2xo':v
        },
        filename : String
    },
    price : {
        type : Number,
        required : true
    },
    location : { 
        type : String,
        required: true
    },
    country : { 
        type : String,
        required: true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }

});
const Listing = mongoose.model('Listing',listSchema);

// middleware to deletes review related to a listing when that listing is deleted
// use findOneAndDelete as findByIdAndDelete calls for findOneAndDelete

listSchema.post("findOneAndDelete", async(listing)=>{
    if(listing.reviews){
       await Review.deleteMany({ _id : { $in : listing.reviews}});
    }
});

module.exports = Listing;