/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
console.log('Connecting to MongoDB...');
mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
  });

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^0\d{1,2}-\d{4,8}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Contact', contactSchema);
