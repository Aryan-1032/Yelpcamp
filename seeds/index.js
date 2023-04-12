if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config();
}
const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers.js');
const Campground = require('../models/campground.js')
mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
mongoose.connect('mongodb://localhost:27017/yelp-camp',{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log(err);
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array)=>{
   return array[Math.floor(Math.random() * array.length)];
}

 
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i =0;i<200;i++)
    {
        const random = Math.floor(Math.random()*1000);
        const camp = new Campground({
            author:"62bea136278aea23bba93139",
            location:`${cities[random].city},${cities[random].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            geometry:{
              type:'Point',
              coordinates: [cities[random].longitude,cities[random].latitude]
            },
            price:random,
            image: [
                {
                  url: 'https://res.cloudinary.com/de3ssohre/image/upload/v1657051959/yelpcamp/x5sw5qhv7kpzecvmfqii.jpg',
                  filename: 'yelpcamp/x5sw5qhv7kpzecvmfqii',
                  
                },
                {
                  url: 'https://res.cloudinary.com/de3ssohre/image/upload/v1657051961/yelpcamp/dqlfo2gocqupp9izevo6.jpg',
                  filename: 'yelpcamp/dqlfo2gocqupp9izevo6',
                  
                },
                {
                  url: 'https://res.cloudinary.com/de3ssohre/image/upload/v1657051962/yelpcamp/mcndqhlwlrmlwvkun7ms.jpg',
                  filename: 'yelpcamp/mcndqhlwlrmlwvkun7ms',
                    },
                {
                  url: 'https://res.cloudinary.com/de3ssohre/image/upload/v1657051963/yelpcamp/udhlkmasbm7ji4sh8bmi.jpg',
                  filename: 'yelpcamp/udhlkmasbm7ji4sh8bmi',
                   
                }
              ],
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus iusto natus neque sint eos architecto quos, at pariatur laborum adipisci quisquam delectus sunt iure optio cum reprehenderit modi ipsum consequatur'
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});