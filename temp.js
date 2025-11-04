const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hrishikeshaparaitech:hrishikesh1806@cluster0.btuaego.mongodb.net')
  .then(() => {
    console.log('Connected to Atlas');
    mongoose.connection.db.collection('manualusers')
      .findOne({})
      .then(user => {
        console.log('User found:', user);
        mongoose.disconnect();
      });
  })
  .catch(err => console.log('MongoDB error:', err));
