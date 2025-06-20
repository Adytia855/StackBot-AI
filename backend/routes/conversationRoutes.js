/**
 * @fileoverview Defines the routes for managing conversations and their messages.
 * This router handles operations like listing, creating, and deleting conversations,
 * as well as fetching, adding, and deleting messages within a specific conversation.
 * @module routes/conversationRoutes
 */
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

/**
 * Route to list all conversations.
 * @name GET /
 * @function
 * @memberof module:routes/conversationRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware (conversationController.listConversations).
 */
router.get('/', conversationController.listConversations);

/**
 * Route to create a new conversation.
 * @name POST /
 * @function
 * @memberof module:routes/conversationRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware (conversationController.createConversation).
 */
router.post('/', conversationController.createConversation);

/**
 * Route to delete a specific conversation by its ID.
 * @name DELETE /:id
 * @function
 * @memberof module:routes/conversationRoutes
 * @inner
 * @param {string} path - Express path with ID parameter.
 * @param {callback} middleware - Express middleware (conversationController.deleteConversation).
 */
router.delete('/:id', conversationController.deleteConversation);

/**
 * Route to get all messages for a specific conversation by its ID.
 * @name GET /:id/messages
 * @function
 * @memberof module:routes/conversationRoutes
 * @inner
 * @param {string} path - Express path with ID parameter.
 * @param {callback} middleware - Express middleware (conversationController.getMessages).
 */
router.get('/:id/messages', conversationController.getMessages);

/**
 * Route to add a new message to a specific conversation by its ID.
 * @name POST /:id/messages
 * @function
 * @memberof module:routes/conversationRoutes
 * @inner
 * @param {string} path - Express path with ID parameter.
 * @param {callback} middleware - Express middleware (conversationController.addMessage).
 */
router.post('/:id/messages', conversationController.addMessage);

/**
 * Route to delete a specific message from a conversation.
 * @name DELETE /:id/messages/:msgId
 * @function
 * @memberof module:routes/conversationRoutes
 * @inner
 * @param {string} path - Express path with conversation ID and message ID parameters.
 * @param {callback} middleware - Express middleware (conversationController.deleteMessage).
 */
router.delete('/:id/messages/:msgId', conversationController.deleteMessage);

module.exports = router;
