'use strict'
const messages = require('./api/messages')

exports.dispatch = messages.dispatch
exports.messages = messages

exports.conversations = require('./api/conversations')
exports.templates = require('./api/templates')
