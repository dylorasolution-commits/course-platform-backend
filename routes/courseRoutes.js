const express = require("express");
const router = express.Router();
const Course = require("../models/Course");


// ============================
// CREATE COURSE
// ============================
router.post("/", async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      isFree: price === 0
    });

    res.status(201).json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ============================
// GET ALL COURSES
// ============================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ============================
// GET COURSE BY ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ============================
// UPDATE COURSE
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        isFree: price === 0
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ============================
// DELETE COURSE
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
