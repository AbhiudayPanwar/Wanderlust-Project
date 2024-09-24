const { ref } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const reviewSchema = new Schema({
content : String,
rating : {
    type : Number,
    min : 1,
    max : 5
},
date : {

    type : Date,
    default : Date.now()
},
author : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
}
});
module.exports = mongoose.model("Review",reviewSchema);