/**
 * @fileoverview This is the main application file for the Express server.
 * It sets up essential middleware like CORS and JSON parsing,
 * and mounts the chat and conversation route handlers.
 * Environment variables are loaded using dotenv.
 * @module app
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file

const chatRoutes = require('./routes/chatRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all origins
app.use(cors());

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

/**
 * Mounts the chat-related routes under the /api path.
 * @name /api
 * @function
 * @memberof module:app
 * @inner
 * @param {string} path - The base path for chat routes.
 * @param {express.Router} middleware - The chat routes router.
 */
app.use('/api', chatRoutes);

/**
 * Mounts the conversation-related routes under the /api/conversations path.
 * @name /api/conversations
 * @function
 * @memberof module:app
 * @inner
 * @param {string} path - The base path for conversation routes.
 * @param {express.Router} middleware - The conversation routes router.
 */
app.use('/api/conversations', conversationRoutes);

/**
 * The configured Express application instance.
 * @exports app
 */
module.exports = app;
