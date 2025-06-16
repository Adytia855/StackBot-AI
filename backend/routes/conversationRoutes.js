const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.get('/', conversationController.listConversations);
router.post('/', conversationController.createConversation);
router.delete('/:id', conversationController.deleteConversation);
router.get('/:id/messages', conversationController.getMessages);
router.post('/:id/messages', conversationController.addMessage);
router.delete('/:id/messages/:msgId', conversationController.deleteMessage);

module.exports = router;
