const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Application = require('../models/application');
const ApplicationRecord = require('../models/applicationRecord');
const User = require('../models/user');
const Faculty = require('../models/users/faculty');
const { isLoggedIn, isAuthor, isReceiver, isAuthorAndReceiver, validateApplication } = require('../middleware.js');

const isNotModifier = async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);
  if (application.statusModifiers.some(user => user._id.equals(req.user._id))) {
    // means you have already modified
    req.flash('error', `you donot have the permission to do that`);
    return res.redirect(`/applications/${application._id}`);
  }
  next();
}

router.get('/', isLoggedIn, async (req, res) => {
  const applications = await Application.find({ author: req.user._id });
  res.render('applications/index', { applications })
})

router.get('/new', isLoggedIn, async (req, res) => {
  // find all the teachers
  const users = await User.find().populate('role')
  const facultyDetails = [];
  for (let user of users) {
    if ((user._id.toString() !== req.user._id.toString()) && user.role.userType === 'Faculty') {
      const faculty = {
        username: user.username,
        userId: user._id
      };
      facultyDetails.push(faculty);
    }
  }
  res.render('applications/new', { facultyDetails });
})

router.post('/', isLoggedIn, validateApplication, catchAsync(async (req, res, next) => {
  const application = new Application(req.body.application)
  application.author = req.user._id;
  await application.save();

  const applicationRecord = new ApplicationRecord({
    applicationId: application._id,
    sender: application.author,
    receiver: application.to,
  })
  await applicationRecord.save();
  req.flash('success', 'Successfully submitted a new application')
  res.redirect(`/applications/${application._id}`);
}));

router.get('/:id', isLoggedIn, isAuthorAndReceiver, async (req, res) => {
  const application = await Application.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author').populate('to').populate({
    path: 'forwards',
    populate: {
      path: 'forwardedBy'
    },
  }).populate({
    path: 'forwards',
    populate: {
      path: 'forwardedTo'
    }
  }).populate({
    path: 'status',
    populate: {
      path: 'author'
    }
  });
  if (!application) {
    req.flash('error', 'cannot find that application');
    return res.redirect('/applications');
  }
  res.render('applications/show', { application })
})

router.put('/:id', isLoggedIn, isReceiver, isNotModifier, catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const application = await Application.findById(id);
  const idxOfStatus = application.status.indexOf(doc => doc.statusType === status);
  if (idxOfStatus !== -1) {
    application.status[idxOfStatus].author.push(req.user._id);
    application.statusModifiers.push(req.user._id);
    await application.save();
    return res.redirect(`/applications/${application._id}`)
  }
  const obj = {
    statusType: null,
    author: [],
  };
  obj.statusType = status;
  obj.author.push(req.user._id)

  application.status.push(obj);

  application.statusModifiers.push(req.user._id);
  await application.save();
  res.redirect(`/applications/${application._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  await Application.findByIdAndDelete(req.params.id);
  req.flash('success', 'successfully deleted application')
  res.redirect('/applications');
})

router.get('/:id/forward', isLoggedIn, isReceiver, catchAsync(async (req, res) => {
  const { id } = req.params;
  const application = await Application.findById(id);
  const users = await User.find().populate('role')
  const facultyDetails = [];
  for (let user of users) {
    if ((user._id.toString() !== req.user._id.toString()) && user.role.userType === 'Faculty') {
      const faculty = {
        username: user.username,
        userId: user._id
      };
      facultyDetails.push(faculty);
    }
  }
  res.render('applications/forward', { facultyDetails, application });
}))

router.put('/:id', isLoggedIn, isReceiver, catchAsync(async (req, res) => {
  console.log('hello')
  const { id } = req.params;
  const { to } = req.body.application;
  const application = await Application.findById(id).populate('to');
  if (!application.to.some(receiver => receiver._id.equals(to._id))) {
    console.log('world');
    application.to.push(to);
  }

  for (let forward of application.forwards) {
    if (forward.forwardedBy._id.equals(req.user._id) && forward.forwardedTo.includes(to)) {
      req.flash('success', 'It was already forwared')
      return res.redirect(`/applications`);
    }
  }
  // forward records
  if (!application.forwards.some(forward => req.user._id.equals(forward.forwardedBy._id))) {
    const obj = {
      forwardedBy: null,
      forwardedTo: []
    }
    obj.forwardedBy = req.user._id;
    obj.forwardedTo.push(to);
    application.forwards.push(obj);
  }
  else {
    for (let forward of application.forwards) {
      if (req.user._id.equals(forward.forwardedBy._id)) {
        forward.forwardedBy = req.user._id;
        forward.forwardedTo.push(to);
        break;
      }
    }
  }
  await application.save();
  req.flash('success', 'forwared successfully');
  res.redirect(`/applications`);
}))

module.exports = router;