const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat', chatController.chat);
router.get('/history', chatController.history);
router.delete('/history', chatController.clearHistory);
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await require('../models/Message').findByIdAndDelete(id);
    res.json({ success: true, message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting chat', detail: err.message });
  }
});

module.exports = router;
