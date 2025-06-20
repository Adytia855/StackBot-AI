/**
 * @fileoverview Defines the Mongoose schema for a message and exports the Message model.
 * A message consists of user input and a bot response, with automatic timestamps.
 * @module models/Message
 */
const { Schema, model } = require('mongoose');

/**
 * Represents the schema for an individual message.
 * Includes the user's message, the bot's response, and automatically managed
 * `createdAt` and `updatedAt` timestamps.
 * @const {mongoose.Schema} messageSchema
 * @property {String} user - The content of the user's message.
 * @property {Boolean} user.required - Indicates that the user message is a required field.
 * @property {String} bot - The content of the bot's response.
 * @property {Boolean} bot.required - Indicates that the bot response is a required field.
 * @property {Date} createdAt - Automatically set to the time the message document was created.
 * @property {Date} updatedAt - Automatically set to the time the message document was last updated.
 */
const messageSchema = new Schema({
  user: { type: String, required: true },
  bot: { type: String, required: true }
}, { timestamps: true }); // `timestamps: true` automatically adds `createdAt` and `updatedAt` fields

/**
 * Mongoose model for the 'Message' collection.
 * This model uses the `messageSchema` to define the structure of message documents.
 * @exports {mongoose.Model<mongoose.Document & typeof messageSchema>}
 */
module.exports = model('Message', messageSchema);

