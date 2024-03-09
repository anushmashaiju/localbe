const mongoose = require("mongoose")
const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    max: 500
  },
  image: {
    type: String,

  },
  location: {
    type: String , // Add location field
    required:true
  },
  postDate: {
    type: Date,   // Add post date field
    default: Date.now
  },
  likes: {
    type: Array,
    default: [],
  },

},
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema)