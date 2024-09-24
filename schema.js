const joi = require('joi');
listingSchema = joi.object({
    listing : joi.object({
        title       : joi.string().required(),
        description : joi.string().required(),
        image       : joi.string().allow("",null),
        price       : joi.number().required(),
        location    : joi.string().required(),
        country     : joi.string().required(),

    }).required(),
});
module.exports = listingSchema;


reviewSchema = joi.object({
    review : joi.object({
        content     : joi.string().required(),
        rating      : joi.number().max(5).min(1).required(),
        date        : joi.date().allow("",null)

    }).required(),
});
module.exports = reviewSchema;