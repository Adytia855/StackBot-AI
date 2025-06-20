/**
 * @fileoverview This is the main entry point for the backend server.
 * It initializes the database connection, loads environment variables,
 * and starts the Express application, listening on a specified port.
 * @module server
 */
require('dotenv').config(); // Load environment variables from a .env file into process.env
const app = require('./app'); // Import the configured Express application
const connectDB = require('./config/db'); // Import the database connection function

// Define the port for the server, using the environment variable or defaulting to 3001
const PORT = process.env.PORT || 3001;

// Asynchronously connect to the database and then start the Express server.
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
});
