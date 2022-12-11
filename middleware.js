const { applicationSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Application = require('./models/application');
const Review = require('./models/review');
const UserInfo = require('./models/secondary/userInfo');
const user = require('./models/user.js');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  next();
}

module.exports.validateApplication = (req, res, next) => {
  const { error } = applicationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application.author._id.equals(req.user._id)) {
    req.flash('error', 'cannot find that application or you do not have permission');
    return res.redirect('/applications');
  }
}

module.exports.isReceiver = async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application.to.some(user => user.equals(req.user._id))) {
    req.flash('error', 'cannot find that application or you do not have permission');
    return res.redirect('/applications');
  }
  next();
}

module.exports.isAuthorAndReceiver = async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application.author._id.equals(req.user._id)) {
    const isReciever = application.to.some(user => user.equals(req.user._id));
    if (!isReciever) {
      console.log('hello');
      req.flash('error', 'cannot find that application or you do not have permission');
      return res.redirect('/applications');
    }
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'cannot find that application or you do not have permission');
    return res.redirect(`/applications/${id}`);
  }
  next();
}

module.exports.isVerified = (req, res, next) => {
  if (!req.session.isVerified) {
    req.flash('error', 'you need to verify before registration. Click get password to verify');
    return res.redirect('/login');
  }
  next();
}

module.exports.isValid = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    const userinfo = await UserInfo.findOne().where('mail').equals(email);
    console.log(userinfo);
    if (!userinfo) {
      req.flash('error', `${email} is not a Tezpur University Mail`);
      return res.redirect('/otp');
    }
    next();
  } catch (e) {
    next(e);
  }
}