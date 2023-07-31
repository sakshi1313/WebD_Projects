const express = require('express')
const app = express();
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require("joi");
const { campgroundSchema } = require('./schemas');
const ejsMate = require('ejs-mate');
app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));

const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
    
}

const mongoose = require('mongoose');
const { validate } = require('./models/campground');
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// -------------------------- ROUTES ---------------------------
app.get('/', (req,res) => {
    res.render('home')
})


// ------------------ INDEX -------------------------
app.get('/campgrounds', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})

}))


// --------------- NEW --------------------------------
app.get('/campgrounds/new', catchAsync(async(req,res) => {
    res.render('campgrounds/new')
}))

app.post('/campgrounds',validateCampground, catchAsync(async (req, res, next) => {
    // if(rea.body.campground) throw new ExpressError('Invalid data', 400)

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    
}))

// ----------------- SHOW----------------------------

app.get('/campgrounds/:id', catchAsync(async(req,res) => {
    const campgrounds = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campgrounds})
}))

// ------------ UPDATE/EDIT ------------------

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground,catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));


//------------------------ DELETE ---------------------------

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));




// ------------------- ERROR HANDELING -------------------------------


app.all('*',(req,res,next) => {
    next(new ExpressError("Page not found", 404))
})
app.use((err,req,res,next) => {
    const {statusCode = 500, message = "Something went wrong"} = err;
    if(!err.message) err.message='Oh no something went wrong'
    res.status(statusCode).render('error',{err});
    res.send('something went wrong');
})










app.listen(8080, () => {
    console.log("APP IS LISTENING ON PORT 8080!")
})