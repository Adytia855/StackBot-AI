/**
 * @fileoverview Controller functions for handling chat interactions,
 * fetching chat history, and clearing chat history.
 * It interacts with the Gemini API for generating chat responses and
 * uses the Message model for database operations.
 * @module controllers/chatController
 */
const Message = require('../models/Message');
const fetch = require('node-fetch');

/**
 * Handles incoming chat messages, sends them to the Gemini API,
 * stores the conversation, and returns the bot's reply.
 * @async
 * @function chat
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.message - The user's message.
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends a JSON object with the bot's reply: `{ reply: string }`.
 * @sends {json} On error, sends a JSON object with an error message and status 500:
 *               `{ error: string, detail: string }`.
 */
exports.chat = async (req, res) => {
  const userMessage = req.body.message;
  try {
    // Make a POST request to the Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: { maxOutputTokens: 256, temperature: 0.7 }
      })
    });
    const data = await response.json();

    // Extract the bot's reply, providing a default if not found
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '[No response]';

    // Store the user message and bot reply in the database
    await Message.create({ user: userMessage, bot: reply });

    res.json({ reply });
  } catch (err) {
    console.error('Error in chat controller:', err); // It's good practice to log the error server-side
    res.status(500).json({ error: 'Error contacting Gemini API', detail: err.message });
  }
};

/**
 * Fetches the last 20 chat messages from the database.
 * @async
 * @function history
 * @param {import('express').Request} _req - The Express request object (unused).
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends a JSON array of message objects.
 * @sends {json} On error, sends a JSON object with an error message and status 500:
 *               `{ error: string, detail: string }`.
 */
exports.history = async (_req, res) => {
  try {
    // Retrieve the last 20 messages, sorted by creation date in descending order
    const history = await Message.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err); // Server-side logging
    res.status(500).json({ error: 'Error fetching history', detail: err.message });
  }
};

/**
 * Clears all chat messages from the database.
 * @async
 * @function clearHistory
 * @param {import('express').Request} _req - The Express request object (unused).
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends a JSON object indicating success:
 *               `{ success: true, message: string }`.
 * @sends {json} On error, sends a JSON object with an error message and status 500:
 *               `{ error: string, detail: string }`.
 */
exports.clearHistory = async (_req, res) => {
  try {
    // Delete all documents from the Message collection
    await Message.deleteMany({});
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    console.error('Error clearing history:', err); // Server-side logging
    res.status(500).json({ error: 'Error clearing history', detail: err.message });
  }
};
