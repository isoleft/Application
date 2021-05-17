const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  Name: {
    type: String,
  },
  Num: {
    type: Number,
  }
})
const PostModel = mongoose.model('plans', PostSchema)
module.exports = PostModel