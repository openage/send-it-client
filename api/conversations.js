const roleHelper = require('../helpers/role-helper')
const conversationApi = require('../helpers/request-helper')('conversations')

exports.archive = async (conversation, context) => {
    let id = conversation.id

    let query = {}

    if (!id && conversation.entity) {
        id = 'entity'
        query['entity-id'] = conversation.entity.id
        query['entity-type'] = conversation.entity.type
        query['entity-name'] = conversation.entity.name
    }

    if (!id && conversation.participants) {
        id = 'direct'
        let participant = roleHelper.getRole(conversation.participants[0])
        query['user-ids'] = participant.id
    }

    return conversationApi.update(id, {
        status: 'archived'
    }, {
        query: query
    }, context)
}

exports.all = async (query, context) => {
    return conversationApi.search(query, null, context)
}

exports.get = async (id, context) => {
    return conversationApi.get(id, null, context)
}
