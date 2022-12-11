const mongoose = require('mongoose');
const Application = require('../models/application');
const { types, status } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/paper-less', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Application.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const application = new Application({
      author: "637495c7ded01257dc7319eb",
      type: sample(types),
      status: sample(status),
      subject: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi veniam corporis, officiis quis odio culpa reprehenderit velit quae soluta similique obcaecati iure eum quam mollitia vero non placeat nihil a!'
    })
    await application.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});