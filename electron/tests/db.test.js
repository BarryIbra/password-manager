jest.mock('../db'); // Active __mocks__/db.js

const db = require('../db');
const { encrypt, decrypt } = require('../cryptoUtils');

let userId;

beforeAll(async () => {
    db.__reset();

    // Create test user
    const res = await db.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        ['testuser', 'dummy']
    );
    userId = res.rows[0].id;
});

afterAll(async () => {
    await db.end();
});

describe("CRUD passwords (mocked DB)", () => {
    let pwdId;

    test("should create a password", async () => {
        const password = "Secret123";
        const encrypted = encrypt(password);

        const res = await db.query(
            "INSERT INTO passwords (user_id, name, username, iv, tag, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [userId, "ServiceTest", "user@test.com", encrypted.iv, encrypted.tag, encrypted.content]
        );

        pwdId = res.rows[0].id;
        expect(pwdId).toBeDefined();
    });

    test("should read and decrypt password", async () => {
        const res = await db.query("SELECT * FROM passwords WHERE id=$1", [pwdId]);

        const decrypted = decrypt({
            iv: res.rows[0].iv,
            tag: res.rows[0].tag,
            content: res.rows[0].password
        });

        expect(decrypted).toBe("Secret123");
    });

    test("should update password", async () => {
        const newValue = "NewPass999";
        const encrypted = encrypt(newValue);

        await db.query(
            "UPDATE passwords SET iv=$1, tag=$2, password=$3 WHERE id=$4",
            [encrypted.iv, encrypted.tag, encrypted.content, pwdId]
        );

        const res = await db.query("SELECT * FROM passwords WHERE id=$1", [pwdId]);

        const decrypted = decrypt({
            iv: res.rows[0].iv,
            tag: res.rows[0].tag,
            content: res.rows[0].password
        });

        expect(decrypted).toBe(newValue);
    });

    test("should delete password", async () => {
        await db.query("DELETE FROM passwords WHERE id=$1", [pwdId]);

        const res = await db.query("SELECT * FROM passwords WHERE id=$1", [pwdId]);
        expect(res.rows.length).toBe(0);
    });
});
