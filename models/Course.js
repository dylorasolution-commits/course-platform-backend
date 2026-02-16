const mongoose = require("mongoose");

/**
 * Lesson schema
 */
const lessonSchema = new mongoose.Schema({
  title: String
});

/**
 * Module schema
 */
const moduleSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema]
});

/**
 * Course schema
 */
const courseSchema = new mongoose.Schema({
  title: String,
  modules: [moduleSchema]
});

module.exports = mongoose.model("Course", courseSchema);
