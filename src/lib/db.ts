const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'Edge',
    });
    console.log('MongoDB connected');
    console.log('Connected to DB:', mongoose.connection.name);
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = connectDB;
