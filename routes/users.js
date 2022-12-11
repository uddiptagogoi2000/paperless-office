const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const UserInfo = require('../models/secondary/userInfo');
const Student = require('../models/users/student');
const Faculty = require('../models/users/faculty');
const Role = require('../models/role');
const catchAsync = require('../utils/catchAsync');
const { generateOTP } = require('../generateotp');
const { transporter } = require('../nodemailer');
const Otp = require('../models/secondary/otp');
const ExpressError = require('../utils/ExpressError');
const { isVerified, isValid } = require('../middleware');
const { getMillisecond } = require('../utils/getExpiryDate');
const { createUsername } = require('../utils/helperFunctions');

router.get('/otp', (req, res) => {
  res.render('users/otp');
})

// sending the otp
router.post('/getotp', isValid, catchAsync(async (req, res) => {
  // send the otp
  const { email } = req.body;
  const value = generateOTP();
  // let mailOptions = {
  //   from: 'devdemo@gmail.com',
  //   to: email,
  //   subject: 'OTP verification for Paperless',
  //   text: `Your OTP for paperless is: ${value}`
  // };
  try {
    // const info = await transporter.sendMail(mailOptions);
    // check if email already exits in otp table
    const savedOtp = await Otp.findOne().where('email').equals(email);
    if (savedOtp) {
      savedOtp.value = value;
      const expiryAt = Date.now() + 60000;
      savedOtp.expiresAt = expiryAt.toString();
      await savedOtp.save();
    } else {
      const otp = new Otp({ value, email });
      await otp.save();
    }
    req.session.email = email;
    req.flash('success', `OTP has sent to ${email}`);
  } catch (err) {
    throw new ExpressError('cannot send otp due to Internal server problem or your network problem', 500);
  }
  res.redirect('/otp');
}));

// submit OTP logic
router.post('/otp', async (req, res) => {
  // verify otp
  const { otp } = req.body;
  const docs = await Otp.findOne({ value: otp }); // find() returns and array
  if (getMillisecond(docs.updatedAt) >= Number(docs.expiresAt)) {
    req.flash('error', 'your OTP is has expired. Try Again');
    return res.redirect('/otp');
  }
  if (docs && docs.email === req.session.email) {
    req.flash('success', 'congrats! You are verified...')
    req.session.isVerified = true;
    await Otp.deleteOne({ value: otp, email: req.session.email });
    // await Otp.deleteOne().where('value').equals(otp).where('email')
    return res.redirect('/register');
  }
  req.flash('error', 'OTP is incorrect. Try again');
  res.redirect('/otp');
});

router.get('/register', isVerified, (req, res) => {
  return res.render('users/register', { email: req.session.email });
});

router.post('/register', isVerified, catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //csm21017@tezu.ac.in // find username
    const username = createUsername(email);
    // find the role of the user
    const userInfo = await UserInfo.findOne().where('mail').equals(email).populate('role');

    const userRole = userInfo.role.userType;
    if (userInfo) {
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      registeredUser.role = userInfo.role;
      await registeredUser.save();
      if (userInfo.role.userType === 'Student') {
        const student = new Student({
          userId: registeredUser._id,
          course: 'MCA',
          dept: 'CSE',
        });
        await student.save();
      }
      else if (userInfo.role.userType === 'Faculty') {
        const faculty = new Faculty({
          userId: registeredUser._id,
          isHod: false,
        });
        await faculty.save();
      }
      // const findUser = await User.findOne().where('email').equals(req.user.email).populate('role');
      // req.session.userRole = findUser.role.userType;

      // users, students, faculties
      // req.login(registeredUser, err => {
      //   if (err) return next(err);
      //   req.flash('success', 'Welcome to Paperless');
      //   res.redirect('/applications');
      // })
      req.flash('success', 'Please login');
      res.redirect('/login');
    } else {
      req.flash('error', 'Email is Not valid TU mail');
      res.redirect('/login');
    }
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res, next) => {
  req.flash('success', 'Welcome back!')
  const user = await User.findOne().where('email').equals(req.user.email).populate('role');
  req.session.userRole = user.role.userType;
  res.redirect('/applications');
}))

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success', "Goodbye!");
    res.redirect('/login');
  });
});

module.exports = router;