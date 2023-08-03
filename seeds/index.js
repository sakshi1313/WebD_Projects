const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')

const mongoose = require('mongoose');
// ------------------------- COONECTING TO MONGODB ------------------------
mongoose.connect('mongodb://localhost:27017/yelp-camp' , { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
// ------------------------------------------------------------------------------    


const sample = arr => arr[Math.floor(Math.random() * arr.length)]



const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i<50; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '64ca4fa181af624421222321',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "cool places ",
            price: price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})



