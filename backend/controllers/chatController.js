const Message = require('../models/Message');
const fetch = require('node-fetch');

exports.chat = async (req, res) => {
  const userMessage = req.body.message;
  try {
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
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '[No response]';

    // Save conversation to MongoDB
    await Message.create({ user: userMessage, bot: reply });

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Error contacting Gemini API', detail: err.message });
  }
};

exports.history = async (_req, res) => {
  try {
    const history = await Message.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history', detail: err.message });
  }
};

exports.clearHistory = async (_req, res) => {
  try {
    await Message.deleteMany({});
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Error clearing history', detail: err.message });
  }
};
