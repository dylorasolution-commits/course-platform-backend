const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { enrollCourse } = require("../controllers/enrollmentController");

router.post("/:courseId", auth, enrollCourse);

module.exports = router;
