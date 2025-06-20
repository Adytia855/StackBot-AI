/**
 * @fileoverview This module provides a function to connect to a MongoDB database.
 * It uses the Mongoose library for database interaction and dotenv for managing
 * environment variables, specifically the MongoDB connection URI.
 * @module config/db
 */
const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * It retrieves the MongoDB URI from the environment variables.
 * If the connection is successful, it logs a success message.
 * If the connection fails, it logs an error message and exits the process.
 * @async
 * @function connectDB
 * @throws {Error} If the MongoDB connection fails, the process will exit with code 1.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
