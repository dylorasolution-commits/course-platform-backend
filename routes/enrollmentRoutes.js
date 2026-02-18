const express = require("express");
const router = express.Router();

const {
  enrollFreeCourse,
  getMyCourses,
  validateAccess
} = require("../controllers/enrollmentController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/enroll/:courseId", authMiddleware, enrollFreeCourse);
router.get("/my-courses", authMiddleware, getMyCourses);
router.get("/access/:courseId", authMiddleware, validateAccess);

module.exports = router;
