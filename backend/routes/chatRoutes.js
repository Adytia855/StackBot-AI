/**
 * @fileoverview Defines the routes for chat-related operations.
 * This includes sending messages, retrieving chat history, and clearing history.
 * @module routes/chatRoutes
 */
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * Route to send a new chat message.
 * @name POST /chat
 * @function
 * @memberof module:routes/chatRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/chat', chatController.chat);

/**
 * Route to get the chat history.
 * @name GET /history
 * @function
 * @memberof module:routes/chatRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/history', chatController.history);

/**
 * Route to clear all chat history.
 * @name DELETE /history
 * @function
 * @memberof module:routes/chatRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.delete('/history', chatController.clearHistory);

/**
 * Route to delete a specific chat message by its ID.
 * @name DELETE /history/:id
 * @function
 * @memberof module:routes/chatRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the message to delete.
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends `{ success: true, message: 'Chat deleted' }`.
 * @sends {json} On error, sends `{ error: 'Error deleting chat', detail: string }` with status 500.
 */
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Directly require and use the Message model to delete a specific chat by ID
    await require('../models/Message').findByIdAndDelete(id);
    res.json({ success: true, message: 'Chat deleted' });
  } catch (err) {
    console.error('Error deleting specific chat:', err); // Server-side logging
    res.status(500).json({ error: 'Error deleting chat', detail: err.message });
  }
});

module.exports = router;
