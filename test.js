const passport = require('passport');
const User = require('./models/user')
const Faculty = require('./models/users/faculty');
const UserInfo = require('./models/secondary/userInfo');
const Role = require('./models/role');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/paper-less', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// add roles

const addRole = async (userType, typeValue) => {
  const role = new Role({
    userType,
    typeValue,
  })
  await role.save();
  console.log(role);
}

// addRole('Student', 0);
// addRole('Faculty', 1);

const addUserInfo = async (mail, role) => {
  const userinfo = new UserInfo({
    mail,
    role,
  })
  await userinfo.save();
  console.log(userinfo);
}

// students
// addUserInfo('csm21017@tezu.ac.in', '638a406049dccababd799bfe');
// addUserInfo('csm21018@tezu.ac.in', '638a406049dccababd799bfe');

// faculty
// addUserInfo('usharma@tezu.ac.in', '638a406049dccababd799bff');
// addUserInfo('bnath@tezu.ac.in', '638a406049dccababd799bff');
// addUserInfo('snath@tezu.ac.in', '638a406049dccababd799bff');

// populate userinfos // yey it workes
const findRole = async () => {
  // this returns an array
  // const user = await UserInfo.where('mail').equals('csm21017@tezu.ac.in').populate('role');
  const user = await UserInfo.findOne().where('mail').equals('csm21017@tezu.ac.in').populate('role');
  // console.log(user[0].role.userType);
  console.log(user.role.userType);
}

// findRole();