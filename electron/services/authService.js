const pool = require('../db');
const bcrypt = require('bcrypt');

async function registerUser({ username, password }) {
    const hashed = await bcrypt.hash(password, 10);

    try {
        await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, hashed]
        );

        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function loginUser({ username, password }) {
    const res = await pool.query(
        'SELECT * FROM users WHERE username=$1',
        [username]
    );

    if (res.rows.length === 0)
        return { success: false, error: 'Utilisateur inconnu' };

    const user = res.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
        return { success: false, error: 'Mot de passe incorrect' };

    return {
        success: true,
        user: { id: user.id, username: user.username }
    };
}

module.exports = { registerUser, loginUser };
