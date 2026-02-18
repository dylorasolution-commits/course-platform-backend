const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect directly to local MongoDB on default port 27017
    const MONGODB_URI = 'mongodb://localhost:27017/course_platform';

    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
