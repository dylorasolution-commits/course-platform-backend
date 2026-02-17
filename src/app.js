const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/enroll", require("./routes/enrollment.routes"));
app.use("/api/courses", require("./routes/course.routes"));
app.use("/api/assessment",require("./routes/assessment.routes"));
app.use("/api/certificate",require("./routes/certificate.routes"));
app.use("/api/progress",require("./routes/progress.routes"));

app.use(errorMiddleware);

app.get("/test-mail", async (req, res) => {
  const { sendEmail } = require("./config/mail");

  await sendEmail(
    process.env.TEST_EMAIL || process.env.SMTP_USER,
    "Test Mail",
    "<h1>Email Working ✅</h1>"
  );

  res.send("Mail sent");
});


module.exports = app;
