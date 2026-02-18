const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.enrollFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isFree) {
      return res.status(400).json({ message: "This is a paid course" });
    }

    const alreadyEnrolled = await Enrollment.findOne({ userId, courseId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = await Enrollment.create({ userId, courseId });

    res.status(201).json({
      message: "Successfully enrolled",
      enrollment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      userId: req.user.id
    }).populate("courseId");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateAccess = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.json({ message: "Access Granted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
