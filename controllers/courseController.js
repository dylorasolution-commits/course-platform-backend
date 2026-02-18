// controllers/enrollmentController.js
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.enrollFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isFree) {
      return res.status(400).json({ message: "This is a paid course" });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      userId: req.user.id,
      courseId: courseId
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = new Enrollment({
      userId: req.user.id,
      courseId: courseId
    });

    await enrollment.save();

    res.json({ message: "Successfully enrolled" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
