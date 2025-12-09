const crypto = require('crypto');
require('dotenv').config();

const AES_KEY = Buffer.from(process.env.AES_KEY); // 32 bytes required

// Encrypt AES‑256‑GCM
function encrypt(text) {
    const iv = crypto.randomBytes(12); // recommended for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', AES_KEY, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
        iv: iv.toString('base64'),
        content: encrypted.toString('base64'),
        tag: tag.toString('base64')
    };
}

// Decrypt AES‑256‑GCM
function decrypt(encrypted) {
    const iv = Buffer.from(encrypted.iv, 'base64');
    const content = Buffer.from(encrypted.content, 'base64');
    const tag = Buffer.from(encrypted.tag, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', AES_KEY, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
    return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
