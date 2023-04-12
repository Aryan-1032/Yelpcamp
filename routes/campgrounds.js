const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const Review = require('../models/review.js');
const Campground = require('../models/campground.js')
const ExpressError = require('../utils/ExpressError.js');
const methodOverride = require('method-override');
const {campgroundSchema} = require('../views/schema.js')
const {isLoggedIn,isAuthor,validateCampgroundData} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer= require('multer')

const {storage} = require('../cloudinary');
const upload = multer({storage});
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampgroundData, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'),(req,res)=>{
    //     res.send(req.body);
    //     console.log(req.files);
    // })

router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

router.route('/:id')
        .get(catchAsync(campgrounds.showCampground))
        .put(isLoggedIn,isAuthor,upload.array('image'),validateCampgroundData, catchAsync(campgrounds.editCampground))
        .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

 module.exports= router;
