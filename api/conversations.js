const roleHelper = require('../helpers/role-helper')
const conversationApi = require('../helpers/request-helper')('conversations')

const extract = (conversation, context) => {
    if (typeof conversation !== 'object') {
        return {
            id: conversation
        }
    }
    let id = conversation.id

    let query = {}

    if (conversation.entity) {
        query['entity-id'] = conversation.entity.id
        query['entity-type'] = conversation.entity.type
        query['entity-name'] = conversation.entity.name
    }

    if (conversation.participants && conversation.participants.length) {
        let participant = roleHelper.getRole(conversation.participants[0])
        query['user-ids'] = participant.id
    }

    if (!id) {
        if (conversation.entity) {
            id = 'entity'
        } else if (conversation.participants) {
            id = 'direct'
        }
    }

    return {
        id: id,
        query: query
    }
}

/**
 * takes id or conversation
*/
exports.archive = async (conversation, context) => {
    let item = extract(conversation)

    return conversationApi.update(item.id, {
        status: 'archived'
    }, {
        query: item.query
    }, context)
}

exports.search = async (query, context) => {
    return conversationApi.search(query, null, context)
}

/**
 * takes id or the conversation
*/
exports.get = async (id, context) => {
    let item = extract(id)
    return conversationApi.get(item.id, {
        query: item.query
    }, context)
}

exports.create = async (model, context) => {
    return conversationApi.create(model, null, context)
}

/**
 * takes id or the conversation
*/
exports.update = async (id, model, context) => {
    let item = extract(id)
    return conversationApi.update(item.id, model, {
        query: item.query
    }, context)
}

exports.participants = (id) => {
    let item = extract(id)
    return {
        add: async (user, context) => {
            return conversationApi.create(user, {
                path: `${item.id}/participants`,
                query: item.query
            }, context)
        },
        remove: async (user, context) => {
            let role = roleHelper.getRole(user)
            return conversationApi.remove(`${item.id}/participants/${role.id}`, {
                query: item.query
            }, context)
        }
    }
}
