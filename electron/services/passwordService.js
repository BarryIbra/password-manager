const pool = require('../db');
const { encrypt, decrypt } = require('../cryptoUtils');

async function sendPasswords(event, currentUser) {
    if (!currentUser) return;

    const res = await pool.query(
        'SELECT * FROM passwords WHERE user_id=$1',
        [currentUser.id]
    );

    const decrypted = res.rows.map(p => ({
        id: p.id,
        name: p.name,
        username: p.username,
        password: decrypt({
            iv: p.iv,
            tag: p.tag,
            content: p.password
        })
    }));

    event.sender.send('passwords', decrypted);
}

async function addPassword(event, { name, username, password }, currentUser) {
    if (!currentUser) return;

    const encrypted = encrypt(password);

    await pool.query(
        'INSERT INTO passwords (user_id, name, username, iv, tag, password) VALUES ($1, $2, $3, $4, $5, $6)',
        [
            currentUser.id,
            name,
            username,
            encrypted.iv,
            encrypted.tag,
            encrypted.content
        ]
    );

    sendPasswords(event, currentUser);
}

async function updatePassword(event, { id, name, username, password }, currentUser) {
    if (!currentUser) return;

    const encrypted = encrypt(password);

    await pool.query(
        'UPDATE passwords SET name=$1, username=$2, iv=$3, tag=$4, password=$5 WHERE id=$6 AND user_id=$7',
        [
            name,
            username,
            encrypted.iv,
            encrypted.tag,
            encrypted.content,
            id,
            currentUser.id
        ]
    );

    sendPasswords(event, currentUser);
}

async function deletePassword(event, id, currentUser) {
    if (!currentUser) return;

    await pool.query(
        'DELETE FROM passwords WHERE id=$1 AND user_id=$2',
        [id, currentUser.id]
    );

    sendPasswords(event, currentUser);
}

module.exports = {
    sendPasswords,
    addPassword,
    updatePassword,
    deletePassword
};
