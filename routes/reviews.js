const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Application = require('../models/application');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const application = await Application.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  application.reviews.push(review);
  await review.save();
  await application.save();
  res.redirect(`/applications/${application._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Application.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/applications/${id}`);
}));

module.exports = router;