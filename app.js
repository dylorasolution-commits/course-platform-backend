const express = require("express");
const mongoose = require("mongoose");

const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const app = express();

app.use(express.json());

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/enroll", enrollmentRoutes);

module.exports = app;
