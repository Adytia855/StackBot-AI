/**
 * @fileoverview Controller functions for managing conversations and messages within them.
 * This includes listing, creating, and deleting conversations, as well as
 * fetching, adding, and deleting messages in a specific conversation.
 * It interacts with the Gemini API for generating chat responses when adding messages.
 * @module controllers/conversationController
 */
const Conversation = require('../models/Conversation');
const fetch = require('node-fetch');

/**
 * Lists all conversations, returning only their name and creation timestamp.
 * @async
 * @function listConversations
 * @param {import('express').Request} _req - The Express request object (unused).
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends a JSON array of conversation objects, each containing `name` and `createdAt`.
 * @sends {json} On error, sends a JSON object with an error message and status 500:
 *               `{ error: string, detail: string }`.
 */
exports.listConversations = async (_req, res) => {
  try {
    // Find all conversations, selecting only the 'name' and 'createdAt' fields
    const conversations = await Conversation.find({}, 'name createdAt');
    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err); // Server-side logging
    res.status(500).json({ error: 'Error fetching conversations', detail: err.message });
  }
};

/**
 * Creates a new conversation with a given name.
 * @async
 * @function createConversation
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.name - The name for the new conversation.
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends the newly created conversation object.
 * @sends {json} On error, sends a JSON object with an error message and status 500:
 *               `{ error: string, detail: string }`.
 */
exports.createConversation = async (req, res) => {
  try {
    const { name } = req.body;
    // Create a new conversation with the provided name and an empty messages array
    const conversation = await Conversation.create({ name, messages: [] });
    res.json(conversation);
  } catch (err)
{
    console.error('Error creating conversation:', err); // Server-side logging
    res.status(500).json({ error: 'Error creating conversation', detail: err.message });
  }
};

/**
 * Deletes a conversation by its ID.
 * @async
 * @function deleteConversation
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the conversation to delete.
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends a JSON object indicating success: `{ success: true }`.
 * @sends {json} On error, sends a JSON object with an error message and status 500:
 *               `{ error: string, detail: string }`.
 */
exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    // Find and delete the conversation by its ID
    await Conversation.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting conversation:', err); // Server-side logging
    res.status(500).json({ error: 'Error deleting conversation', detail: err.message });
  }
};

/**
 * Fetches all messages for a specific conversation by its ID.
 * @async
 * @function getMessages
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the conversation whose messages are to be fetched.
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends a JSON array of message objects from the conversation.
 * @sends {json} If conversation not found, sends a 404 status with error: `{ error: 'Conversation not found' }`.
 * @sends {json} On other errors, sends a JSON object with an error message and status 500:
 *               `{ error: string, detail: string }`.
 */
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation.messages);
  } catch (err) {
    console.error('Error fetching messages:', err); // Server-side logging
    res.status(500).json({ error: 'Error fetching messages', detail: err.message });
  }
};

/**
 * Adds a new message to a specific conversation and gets a reply from the Gemini API.
 * The user's message and the bot's reply are then saved to the conversation.
 * @async
 * @function addMessage
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the conversation to add a message to.
 * @param {object} req.body - The request body.
 * @param {string} req.body.message - The user's message content.
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends a JSON object with the bot's reply: `{ reply: string }`.
 * @sends {json} If conversation not found, sends a 404 status with error: `{ error: 'Conversation not found' }`.
 * @sends {json} On other errors (e.g., Gemini API error, database error), sends a JSON object
 *               with an error message and status 500: `{ error: string, detail: string }`.
 */
exports.addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message: userMessage } = req.body; // Renamed for clarity
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Call Gemini API to get a response
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

    // Add the user message and bot reply to the conversation's messages array
    conversation.messages.push({ user: userMessage, bot: reply });
    await conversation.save(); // Save the updated conversation
    res.json({ reply });
  } catch (err) {
    console.error('Error adding message:', err); // Server-side logging
    res.status(500).json({ error: 'Error adding message', detail: err.message });
  }
};

/**
 * Deletes a specific message from a conversation.
 * @async
 * @function deleteMessage
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the conversation containing the message.
 * @param {string} req.params.msgId - The ID of the message to delete.
 * @param {import('express').Response} res - The Express response object.
 * @sends {json} On success, sends a JSON object indicating success: `{ success: true }`.
 * @sends {json} If conversation not found, sends a 404 status with error: `{ error: 'Conversation not found' }`.
 * @sends {json} On other errors, sends a JSON object with an error message and status 500:
 *               `{ error: string, detail: string }`.
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id, msgId } = req.params;
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Find the subdocument (message) by its ID and remove it
    const messageToRemove = conversation.messages.id(msgId);
    if (messageToRemove) {
        messageToRemove.remove(); // Mongoose < 7
        // For Mongoose 7+ you might need:
        // conversation.messages.pull({ _id: msgId });
    } else {
        // Optionally handle case where message with msgId is not found within the conversation
        return res.status(404).json({ error: 'Message not found in this conversation' });
    }

    await conversation.save(); // Save the updated conversation
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting message:', err); // Server-side logging
    res.status(500).json({ error: 'Error deleting message', detail: err.message });
  }
};
