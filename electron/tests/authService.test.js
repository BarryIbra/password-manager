// Force Jest to use the mock DB
jest.mock('../db');

const db = require('../db');
const { registerUser, loginUser } = require('../services/authService'); // adapte si chemin différent
const bcrypt = require('bcrypt');

beforeEach(() => {
    db.__reset();
});

describe("Auth Service (mock DB)", () => {

    test("registerUser should create new user", async () => {
        const res = await registerUser({
            username: "alice",
            password: "Password123!"
        });

        expect(res.success).toBe(true);
    });

    test("registerUser should fail on duplicate username", async () => {
        await registerUser({ username: "bob", password: "xxx" });

        const res = await registerUser({
            username: "bob",
            password: "yyy"
        });

        expect(res.success).toBe(false);
        expect(res.error).toMatch(/duplicate/i);
    });

    test("loginUser should succeed with correct credentials", async () => {
        const password = "Secret!";
        const hashed = await bcrypt.hash(password, 10);

        // Insert directly in mock database
        await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            ["charlie", hashed]
        );

        const res = await loginUser({
            username: "charlie",
            password: "Secret!"
        });

        expect(res.success).toBe(true);
        expect(res.user).toBeDefined();
        expect(res.user.username).toBe("charlie");
    });

    test("loginUser should fail for unknown user", async () => {
        const res = await loginUser({
            username: "ghost",
            password: "xxx"
        });

        expect(res.success).toBe(false);
        expect(res.error).toMatch(/inconnu/i);
    });

    test("loginUser should fail for wrong password", async () => {
        const hashed = await bcrypt.hash("CorrectPass!", 10);

        await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            ["dave", hashed]
        );

        const res = await loginUser({
            username: "dave",
            password: "WrongPass"
        });

        expect(res.success).toBe(false);
        expect(res.error).toMatch(/incorrect/i);
    });

});
