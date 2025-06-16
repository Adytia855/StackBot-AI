const Conversation = require('../models/Conversation');
const fetch = require('node-fetch');

exports.listConversations = async (_req, res) => {
  try {
    const conversations = await Conversation.find({}, 'name createdAt');
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching conversations', detail: err.message });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { name } = req.body;
    const conversation = await Conversation.create({ name, messages: [] });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: 'Error creating conversation', detail: err.message });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    await Conversation.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting conversation', detail: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conversation.messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages', detail: err.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        generationConfig: { maxOutputTokens: 256, temperature: 0.7 }
      })
    });
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '[No response]';

    conversation.messages.push({ user: message, bot: reply });
    await conversation.save();
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Error adding message', detail: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id, msgId } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    conversation.messages.id(msgId).remove();
    await conversation.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting message', detail: err.message });
  }
};
