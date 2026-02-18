const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect("mongodb://127.0.0.1:27017/course_platform")
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch(err => console.log(err));
