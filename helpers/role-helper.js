/**
 *
 * @param {*} param
 * @param {*} context
 * @returns
 */
exports.getRole = (param, context) => {
    if (!param) {
        return
    }
    let role

    if (param.role) {
        role = param.role
    } else if (param.roles) {
        if (param.roles.length === 1) {
            role = param.roles[0]
        } else {
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
    }

    if (role && role.id) {
        return {
            role: {
                id: role.id
            }
        }
    }

    if (param.code || param.email || param.phone || param.address) {
        return {
            code: param.code,
            email: param.email,
            phone: param.phone,
            address: param.address
        }
    }

    return null
}
