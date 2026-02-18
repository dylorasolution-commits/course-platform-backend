const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  getUsers,
  getUser,
  deleteUser,
  enrollCourse,
  getEnrolledCourses,
  getMyCertificates,
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/enroll/:courseId', protect, enrollCourse);
router.get('/enrolled-courses', protect, getEnrolledCourses);
router.get('/certificates', protect, getMyCertificates);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
