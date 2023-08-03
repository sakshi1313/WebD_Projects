const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')


module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})

}

module.exports.renderNewForm = async(req,res) => {
   
    res.render('campgrounds/new')
}

module.exports.createNewForm = async (req, res, next) => {
    
    if(!req.body.campground) throw new ExpressError('Invalid data', 400)
    const campground = new Campground(req.body.campground);
    campground.images= req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground');

    res.redirect(`/campgrounds/${campground._id}`)
    
}

module.exports.ShowCampground = async(req,res) => {
    const campgrounds = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campgrounds})
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    // if(!campground.author.equals(req.user._id))
    // {
    //     req.flash("error", "you do not have permission to do that");
    //     return res.redirect(`/campgrounds/${id }`)
    // }
    res.render('campgrounds/edit', { campground });
}


module.exports.CreateEditForm = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    // const campground = await Campground.findById(id);
    // if(!campground.author.equals(req.user._id))
    // {
    //     req.flash("error", "you do not have permission to do that");
    //     return res.redirect(`/campgrounds/${id}`)
    // }
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    console.log(campground)
    req.flash("success", "Successfully updated campground")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.DeleteForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // if(!campground.author.equals(req.user._id))
    // {
    //     req.flash("error", "you do not have permission to do that");
    //     return res.redirect(`/campgrounds/${id}`)
    // }
    // const { id } = req.params;
    // await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground")
    res.redirect('/campgrounds');
}