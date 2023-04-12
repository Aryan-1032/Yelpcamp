const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
const {cloudinary} = require('../cloudinary')
module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}
module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}
module.exports.createCampground =async(req,res,next)=>{
   const geoData = await geocoder.forwardGeocode({
    query:req.body.campground.location,
   }).send(); 
    const campground = new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    console.log(geoData.body.features[0].geometry)
    campground.image=req.files.map((f)=>{
        return {
            url:f.path,
            filename:f.filename
        }
    })
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','succesfully made a new campground!!')
    res.redirect(`/campgrounds/${campground._id}`);
   
}

module.exports.showCampground = async (req,res)=>{

    const {id}= req.params;
    const campground = await Campground.findById(id).populate({
        path:'review',
        populate:{ 
            path:'author'
        }
    }).populate('author');
     
    if(!campground)
    {
        req.flash('error','cannot find that campground');
       return res.redirect('/campgrounds')
    }
    
     
    res.render('campgrounds/show',{campground});
 }

 module.exports.renderEditForm = async(req,res)=>{
    const {id}= req.params;
    const campground = await Campground.findById(id);
    if(!campground)
    {
        req.flash('error','cannot find that campground');
       return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/edit',{campground});
}

module.exports.deleteCampground =async(req,res)=>{
    const{id}=req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success','campgruond deleted')
    res.redirect('/campgrounds');
}
module.exports.editCampground = async (req,res)=>{
    const {id}= req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    const imgs = req.files.map((f)=>{
        return {
            url:f.path,
            filename:f.filename
        }
    });
    campground.image.push(...imgs);
    
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
    }
    await campground.save();
    req.flash('success','successfully updated the campground')
    res.redirect(`/campgrounds/${campground._id}`);
}