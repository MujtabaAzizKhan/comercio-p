const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    default: '',
  },
  address: {
    type: String,
    required: false,
    default: '',
  },
  city: {
    type: String,
    required: false,
    default: '',
  },
  isProducer: {
    type: Boolean,
    required: false,
    default: false,
  },
  connections: [
    {
      connectionID: {
        type: String,
        required: false,
      },
      connectionName: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'notAdded'], // Use an enum for status values
        required: false,
      },
    },
  ],
  partners: [
    {
      connectionID: {
        type: String,
        required: false,
      },
      connectionName: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'notAdded'], // Use an enum for status values
        required: false,
      },
    },
  ],
  avatar: {
    type: String,
    default:
      'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
    required: false,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
});
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
  }
  next();
});
userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compareSync(password, this.password);
  return result;
};

module.exports = mongoose.model('User', userSchema);
