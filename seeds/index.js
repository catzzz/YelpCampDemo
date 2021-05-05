const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');


const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
// user id :609024b1e36ad31bfb9cf0d6
const seedBD = async() => {
    await Campground.deleteMany({});
    for(let i = 0 ; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) +10 ;
        const camp = new Campground({
            author: '609024b1e36ad31bfb9cf0d6',
            location : `${cities[random1000].city}, ${cities[random1000.state]}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{ type: 'Point', coordinates: [ -122.3301, 47.6038 ] },
            images: [
                {
                  
                  url: 'https://res.cloudinary.com/dxspz43sd/image/upload/v1620110743/YelpCamp/ozhvihaef2rhp5pcerkd.jpg',
                  filename: 'YelpCamp/ozhvihaef2rhp5pcerkd'
                },
                {
                  
                  url: 'https://res.cloudinary.com/dxspz43sd/image/upload/v1620110743/YelpCamp/foppqnbjnbicd1at8wca.jpg',
                  filename: 'YelpCamp/foppqnbjnbicd1at8wca'
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        });
        await camp.save();
    }
    
}

seedBD().then(() => {
    mongoose.connection.close()
})