const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Faculty = require('../models/users/faculty');
// const ApplicationRecord = require('../')
const Application = require('../models/application');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware')

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
  const applications = await Application.find().where('to').equals(req.user._id); // change to req.user.username
  res.render('faculties/index', { applications });
}));

module.exports = router;