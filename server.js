require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = 20000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
