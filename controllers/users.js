
const User = require('../models/user')
module.exports.renderNewUser = (req,res) => {
    res.render('users/register');
}

module.exports.CreateNewUsers = async(req,res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username})
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err => {
            if(err) return next(err);
            req.flash('success','Welcome to yelpcamp');
            res.redirect('/campgrounds')
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect('register')
    }
    
    // res.send(registeredUser);

    
}

module.exports.renderLogin =  (req,res) => {
    res.render('users/login');
}

module.exports.CreateLogin = (req,res) => {
    req.flash('success', 'welcome back!')
    // console.log(res.locals.returnTo)
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

