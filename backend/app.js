const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);
app.use('/api/conversations', conversationRoutes);

module.exports = app;
