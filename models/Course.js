const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Course", courseSchema);
