// load voteList
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const checkInUser = new Schema({
  user_id: String,
  name: String,
  size: String,
  college: String,
  condition: Number,
  checkedTime: String,
  createdAt: Date,
  updatedAt: Date
})

module.exports = mongoose.model('checkInUser', checkInUser)
