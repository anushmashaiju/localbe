const mongoose = require("mongoose")
const EventSchema = new mongoose.Schema({
  date: {
    type: Date,    
  },
  eventname: {
    type: String,
    required: true
  },

  description: {
    type: String,
    maxlength: 500
  },
  location: { // New field for location
    type: String,
    required: true,
  },
})
  module.exports = mongoose.model("Event", EventSchema)