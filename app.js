const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/enroll", require("./routes/enrollmentRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));

module.exports = app;
