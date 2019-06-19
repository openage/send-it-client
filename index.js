'use strict'
const config = require('config').get('providers')['send-it']
const client = new (require('node-rest-client-promise')).Client()
/**
 *
 * @param {*} param
 * @param {*} context
 * @returns
 */
const getRole = (param, context) => {
    if (!param) {
        return
    }
    let role

    if (param.role) {
        role = param.role
    } else if (param.roles) {
        if (param.roles.length === 1) {
            return param.role
        }

        role = param.roles.find(r => {
            if (context.organization && r.organization) {
                return r.organization.id === context.organization.id
            }
            if (!context.organization && (!r.employee || !r.student)) {
                return true
            }
            return false
        })
    }

    if (role && role.id) {
        return {
            id: role.id
        }
    }

    if (param.email || param.phone || param.address) {
        return {
            email: param.email,
            phone: param.phone,
            address: param.address
        }
    }

    return null
}

/**
 * dispatches the message to providers.send-it.url using the role from context
 * @param { to, subject, body, options} message
 * @param {id, role, session, user: {role: role}} context
 */
const dispatch = async (message, context) => {
    if (!config || !config.url) {
        return
    }
    let recipients = []

    if (message.to && Array.isArray(message.to)) {
        for (const i of message.to) {
            let to = getRole(i, context)
            if (to) {
                recipients.push(to)
            }
        }
    } else if (message.to) {
        let to = getRole(message.to, context)
        if (to) {
            recipients.push(to)
        }
    }

    let options = message.options || {}
    const args = {
        headers: {
            'Content-Type': 'application/json'
        },
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

    if (context.role) {
        args.headers['x-role-key'] = context.role.key
    } else if (context.user && context.user.role) {
        args.headers['x-role-key'] = context.user.role.key
    }

    if (context.session) {
        args.headers['x-session-id'] = context.session.id
    }

    if (context.id) {
        args.headers['x-context-id'] = context.id
    }

    if (message.template) {
        args.data.template = {
            id: message.template.id,
            code: message.template.code || message.template
        }
    }

    if (context.id) {
        args.headers['x-context-id'] = context.id
    }

    let url = `${config.url}/messages`

    context.logger.debug(`sending payload to url: ${url}`)

    let response = await client.postPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(`invalid response from send-it`)
    }
}

exports.dispatch = dispatch
