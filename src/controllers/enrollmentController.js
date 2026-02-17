const Enrollment = require("../models/Enrollment");

exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const courseId = req.params.courseId;

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already enrolled" });
    }
    res.status(500).json({ message: err.message });
  }
};