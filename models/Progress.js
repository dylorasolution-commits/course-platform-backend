const mongoose = require("mongoose");

/**
 * Tracks progress of a user in a course
 */
const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  // Stores completed lessons
  completedLessons: [
    {
      moduleId: String,
      lessonId: String
    }
  ],

  // Calculated percentage
  progressPercentage: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Progress", progressSchema);
