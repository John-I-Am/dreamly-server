const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  dreams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dream'
    }
  ]
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User