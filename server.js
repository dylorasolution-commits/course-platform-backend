const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const progressRoutes = require("./routes/progressRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/progress", progressRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
