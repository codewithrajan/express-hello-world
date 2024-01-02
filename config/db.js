require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URI  = process.env.DATABASE_URL; // Get the MongoDB URI from environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI );

    console.log('MongoDB Connected!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with an error code
  }
};

module.exports = connectDB;
