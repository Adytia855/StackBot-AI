/**
 * @fileoverview Defines Mongoose schemas for messages and conversations,
 * and exports the Conversation model.
 * @module models/Conversation
 */
const mongoose = require('mongoose');

/**
 * Represents the schema for an individual message within a conversation.
 * @const {mongoose.Schema} messageSchema
 * @property {String} user - The content of the user's message.
 * @property {Boolean} user.required - Indicates that the user message is a required field.
 * @property {String} bot - The content of the bot's response.
 * @property {Boolean} bot.required - Indicates that the bot response is a required field.
 * @property {Date} createdAt - The timestamp of when the message was created.
 * @property {Function} createdAt.default - Defaults to the current date and time.
 */
const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  bot: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

/**
 * Represents the schema for a conversation, which includes a name and an array of messages.
 * @const {mongoose.Schema} conversationSchema
 * @property {String} name - The name or identifier of the conversation.
 * @property {Boolean} name.required - Indicates that the conversation name is a required field.
 * @property {Array<messageSchema>} messages - An array of message documents,
 * adhering to the `messageSchema`.
 * @property {Date} createdAt - The timestamp of when the conversation was created.
 * @property {Function} createdAt.default - Defaults to the current date and time.
 */
const conversationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

/**
 * Mongoose model for the 'Conversation' collection.
 * This model uses the `conversationSchema` to define the structure of conversation documents.
 * @exports {mongoose.Model<mongoose.Document & typeof conversationSchema>}
 */
module.exports = mongoose.model('Conversation', conversationSchema);

