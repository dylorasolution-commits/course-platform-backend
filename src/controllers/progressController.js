const Progress = require("../models/Progress");
const Course = require("../models/Course");

/**
 * Mark lesson as completed
 */
exports.completeLesson = async (req, res) => {
  const { courseId, moduleId, lessonId } = req.body;
  const userId = req.user.id;

  let progress = await Progress.findOne({ user: userId, course: courseId });

  if (!progress) {
    progress = new Progress({ user: userId, course: courseId });
  }

  // Avoid duplicate completion
  const alreadyDone = progress.completedLessons.some(
    (l) => l.lessonId === lessonId
  );

  if (!alreadyDone) {
    progress.completedLessons.push({ moduleId, lessonId });
  }

  // Calculate total lessons
  const course = await Course.findById(courseId);
  let totalLessons = 0;

  course.modules.forEach((m) => {
    totalLessons += m.lessons.length;
  });

  progress.progressPercentage =
    (progress.completedLessons.length / totalLessons) * 100;

  await progress.save();

  res.json({
    message: "Lesson completed",
    progress: progress.progressPercentage
  });
};

/**
 * Get progress for a course
 */
exports.getCourseProgress = async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user.id,
    course: req.params.courseId
  });

  if (!progress) {
    return res.json({ progress: 0 });
  }

  res.json(progress);
};