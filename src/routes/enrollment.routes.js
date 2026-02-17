const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { enrollCourse } = require("../controllers/enrollmentController");

router.post("/:courseId", auth, enrollCourse);

module.exports = router;