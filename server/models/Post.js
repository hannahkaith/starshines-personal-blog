// Database Model = for the blog posts
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: { // post title
    type: String,
    required: true
  },
  body: { // post body content
    type: String,
    required: true
  }
}, { timestamps: true }); // automatically adds the createdAt and updatedAt fields

module.exports = mongoose.model('Post', PostSchema);