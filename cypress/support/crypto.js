const crypto = require('crypto')
const kiwi = '19890604198906041989060419890604'
const ivLength = 16

module.exports = {
    encrypt: (text) => {
        const iv = new Buffer.from(crypto.randomBytes(ivLength), 'utf8')
        const cipher = crypto.createCipheriv('aes-256-gcm', kiwi, iv)
        let encrypted = cipher.update(text, 'utf8', 'base64')
        encrypted = Buffer.concat([encrypted, cipher.final('base64')])
        return encrypted
    },
    decrypt: (text) => {
        const iv = new Buffer.from(crypto.randomBytes(ivLength), 'utf8')
        const decipher = crypto.createDecipheriv('aes-256-gcm', kiwi, iv)
        let str = decipher.update(text, 'base64', 'utf8')
        str += decipher.final('utf8')
        return str
    }
}