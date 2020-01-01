'use strict'

const templateApi = require('../helpers/request-helper')('templates')

exports.search = async (query, context) => {
    return templateApi.search(query, null, context)
}

exports.get = async (id, context) => {
    return templateApi.get(id, null, context)
}

exports.create = async (model, context) => {
    return templateApi.create(model, null, context)
}

exports.update = async (id, model, context) => {
    return templateApi.update(id, model, null, context)
}

// var fs = require('fs')
// const path = require('path')
// const uuid = require('uuid/v1')
// const request = require('request')
// const appRoot = require('app-root-path')
// const sendIt = require('config').get('providers.send-it')
// const fileStore = require('config').get('file-store')

// exports.download = async (code, model, context) => {
//     let options = {
//         method: 'POST',
//         url: `${sendIt.url}/docs/${code}.pdf`,
//         // headers: getHeaders(context),
//         json: model
//     }

//     let fileName = `${model.code}-${uuid()}.pdf`

//     let destination = path.join(appRoot.path, `${fileStore.dir}/${fileName}`)
//     let url = `${fileStore.root}/${fileName}`

//     return new Promise((resolve, reject) => {
//         const doc = fs.createWriteStream(destination)

//         doc.on('open', () => {
//             request(options)
//                 .pipe(doc)
//                 .on('error', async (err) => {
//                     doc.close()
//                     await fs.unlinkSync(destination)
//                     return reject(err)
//                 })
//         })

//         doc.on('error', async (err) => {
//             doc.close()
//             if (err.code === 'EXIST') {
//                 reject(new Error('File already exists'))
//             } else {
//                 fs.unlinkSync(destination)
//                 reject(err)
//             }
//         })

//         doc.on('finish', () => {
//             resolve({
//                 fileName,
//                 destination,
//                 url
//             })
//         })
//     })
// }
