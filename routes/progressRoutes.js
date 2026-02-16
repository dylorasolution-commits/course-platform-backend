const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  completeLesson,
  getCourseProgress
} = require("../controllers/progressController");

/**
 * POST - complete lesson
 */
router.post("/complete", auth, completeLesson);

/**
 * GET - get course progress
 */
router.get("/:courseId", auth, getCourseProgress);

module.exports = router;
