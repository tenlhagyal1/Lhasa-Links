const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.String,
        ref: 'User',
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
    },
    sharesCount: {
        type: Number,
        default: 0
    },
    timesstamp: {
        type: Date,
        default: Date.now
    }
  })

  module.exports = mongoose.model('Post', postSchema);