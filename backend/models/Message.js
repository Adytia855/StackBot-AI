const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  user: { type: String, required: true },
  bot: { type: String, required: true }
}, { timestamps: true });

module.exports = model('Message', messageSchema);

// No changes needed, just ensure this file stays in models/Message.js