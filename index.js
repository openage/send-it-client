'use strict'
const messages = require('./api/messages')
const conversations = require('./api/conversations')

exports.dispatch = messages.dispatch
exports.messages = messages

exports.conversations = conversations
