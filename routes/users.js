const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { storeReturnTo } = require('../middleware');

const User = require('../models/user')

//------------ USER CONTROLLER -----------------------------

const users = require('../controllers/users')
// ------------- USER ROUTES---------------------------------------

router.route('/register')
    .get(users.renderNewUser)
    .post(catchAsync(users.CreateNewUsers))


router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.CreateLogin);

router.get('/logout', users.Logout)


// //------- PEHLE AISA THA-----------------------------------------------------
// // ------- SIGNUP ROUTES        
// router.get('/register', users.renderNewUser)


// router.post('/register', catchAsync(users.CreateNewUsers))


// // -------------- LOGIN ROUTES----------------------------

// router.get('/login', users.renderLogin)

// router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.CreateLogin);



// // ------------------ LOGOUT ROUTES -------------------
// router.get('/logout', users.Logout)

























module.exports = router;