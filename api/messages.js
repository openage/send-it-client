'use strict'
const config = require('config').get('providers')['send-it']
const roleHelper = require('../helpers/role-helper')
const headerHelper = require('../helpers/header-helper')
const client = new (require('node-rest-client-promise')).Client()

/**
 * dispatches the message to providers.send-it.url using the role from context
 * @param { to, subject, body, options} message
 * @param {id, role, session, user: {role: role}} context
 */
exports.dispatch = async (message, context) => {
    if (!config || !config.url) {
        return
    }
    let recipients = []

    if (message.to && Array.isArray(message.to)) {
        for (const i of message.to) {
            let to = roleHelper.getRole(i, context)
            if (to) {
                recipients.push(to)
            }
        }
    } else if (message.to) {
        let to = roleHelper.getRole(message.to, context)
        if (to) {
            recipients.push(to)
        }
    }

    let options = message.options || {}
    const args = {
        headers: headerHelper.build(context),
        data: {
            data: message.data,
            to: recipients,
            from: message.from,
            modes: message.modes || options.modes,
            conversation: message.conversation,
            subject: message.subject,
            body: message.body,
            options: options
        }
    }

    if (message.template) {
        args.data.template = {
            id: message.template.id,
            code: message.template.code || message.template
        }
    }

    let url = `${config.url}/messages`

    context.logger.debug(`sending payload to url: ${url}`)

    let response = await client.postPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(`invalid response from send-it`)
    }

    return response.data.data
}
