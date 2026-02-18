const express = require('express');
const router = express.Router();

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addContent,
  rateCourse,
  getMyCourses,
  getAllCoursesAdmin,
  togglePublish,
} = require('../controllers/courseController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Private routes (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/content', protect, authorize('instructor', 'admin'), addContent);
router.put('/:id/publish', protect, authorize('instructor', 'admin'), togglePublish);

// Private routes (Student)
router.post('/:id/ratings', protect, rateCourse);

// Instructor routes
router.get('/instructor/my-courses', protect, authorize('instructor', 'admin'), getMyCourses);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllCoursesAdmin);

module.exports = router;
