const mongoose = require('mongoose');
const Review = require('./review.js')
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const campgroundSchema = new Schema({
    title:String,
    price:Number,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    image:[ImageSchema],
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
})
campgroundSchema.post('findOneAndDelete',async(doc)=>{
    if(doc)
    {
        await Review.deleteMany ({
            _id:{$in:doc.review}
        })
    }
})
module.exports = mongoose.model('Campground',campgroundSchema);