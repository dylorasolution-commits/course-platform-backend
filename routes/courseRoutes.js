const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
} = require("../controllers/courseController");

// GET all courses
router.get("/", getAllCourses);

// POST add course
router.post("/", createCourse);

module.exports = router;
