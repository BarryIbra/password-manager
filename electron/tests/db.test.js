const pool = require('../db');
const { encrypt, decrypt } = require('../cryptoUtils');

let userId;

beforeAll(async () => {
    // Créer un utilisateur de test
    const res = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        ['testuser', 'dummy']
    );
    userId = res.rows[0].id;
});

afterAll(async () => {
    // Nettoyage
    await pool.query('DELETE FROM passwords WHERE user_id=$1', [userId]);
    await pool.query('DELETE FROM users WHERE id=$1', [userId]);
    await pool.end();
});

describe('CRUD passwords', () => {
    let pwdId;

    test('should create a password', async () => {
        const password = 'Secret123';
        const encrypted = encrypt(password);
        const res = await pool.query(
            'INSERT INTO passwords (user_id, name, username, iv, tag, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [userId, 'ServiceTest', 'user@test.com', encrypted.iv, encrypted.tag, encrypted.content]
        );
        pwdId = res.rows[0].id;
        expect(pwdId).toBeDefined();
    });

    test('should read and decrypt password', async () => {
        const res = await pool.query('SELECT * FROM passwords WHERE id=$1', [pwdId]);
        const decrypted = decrypt({
            iv: res.rows[0].iv,
            tag: res.rows[0].tag,
            content: res.rows[0].password
        });
        expect(decrypted).toBe('Secret123');
    });

    test('should update password', async () => {
        const newPwd = 'NouveauMot123';
        const encrypted = encrypt(newPwd);
        await pool.query(
            'UPDATE passwords SET iv=$1, tag=$2, password=$3 WHERE id=$4',
            [encrypted.iv, encrypted.tag, encrypted.content, pwdId]
        );

        const res = await pool.query('SELECT * FROM passwords WHERE id=$1', [pwdId]);
        const decrypted = decrypt({
            iv: res.rows[0].iv,
            tag: res.rows[0].tag,
            content: res.rows[0].password
        });
        expect(decrypted).toBe(newPwd);
    });

    test('should delete password', async () => {
        await pool.query('DELETE FROM passwords WHERE id=$1', [pwdId]);
        const res = await pool.query('SELECT * FROM passwords WHERE id=$1', [pwdId]);
        expect(res.rows.length).toBe(0);
    });
});
