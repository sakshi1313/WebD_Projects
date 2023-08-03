const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");

// --------------------- CONTROLLERS ----------------------------   

const campgrounds = require('../controllers/campgrounds')

// ---------- UPLOADING IMAGE USING MULTER.... CLOUDINARY-----------------
const {storage} = require('../cloudinary')
const multer = require('multer')
const upload = multer({storage})



// ----------------------------------  CAMPGROUNDS --------------------------------------

// --------------MIDDLEWARE THE YAHA PEHLE...NOW SHIFTED TO NEW FILE --------------
// ------------------ INDEX -------------------------

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createNewForm))

    // .post(upload.array('image'),(req,res) => {
    //     res.send(req.files)
    // })

    
router.get('/new',isLoggedIn, catchAsync(campgrounds.renderNewForm));

router.route('/:id')
    .get(catchAsync(campgrounds.ShowCampground))
    .put(isAuthor,isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.CreateEditForm))
    .delete(isAuthor,isLoggedIn,catchAsync(campgrounds.DeleteForm))

router.get('/:id/edit', isAuthor,isAuthor,isLoggedIn,catchAsync(campgrounds.renderEdit))




// // ---- PEHLE AISA KIYE THE --------------------------------------------    
// router.get('/', catchAsync(campgrounds.index));


// // --------------- NEW --------------------------------
// router.get('/new',isLoggedIn, catchAsync(campgrounds.renderNewForm));

// router.post('/',isLoggedIn,validateCampground, catchAsync(campgrounds.createNewForm))

// // ----------------- SHOW----------------------------

// router.get('/:id',catchAsync(campgrounds.ShowCampground))

// // ------------ UPDATE/EDIT ------------------

// router.get('/:id/edit', isAuthor,isAuthor,isLoggedIn,catchAsync(campgrounds.renderEdit))

// router.put('/:id', isAuthor,isLoggedIn,validateCampground,catchAsync(campgrounds.CreateEditForm))


// //------------------------ DELETE ---------------------------

// router.delete('/:id', isAuthor,isLoggedIn,catchAsync(campgrounds.DeleteForm))


module.exports = router;

