const crypto = require("crypto");

// Generate a deterministic AES key for tests if none exists
const AES_KEY = process.env.AES_KEY
    ? Buffer.from(process.env.AES_KEY, "hex")
    : crypto.randomBytes(32);

// Encrypt AES-256-GCM
function encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", AES_KEY, iv);

    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
        iv: iv.toString("hex"),
        tag: tag.toString("hex"),
        content: encrypted.toString("hex"),
    };
}

function decrypt(payload) {
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        AES_KEY,
        Buffer.from(payload.iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(payload.content, "hex")),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}

describe("CryptoUtils AES-256-GCM", () => {

    test("encrypt + decrypt must work", () => {
        const password = "MotDePasseSuperSecret123!";
        const encrypted = encrypt(password);
        const decrypted = decrypt(encrypted);

        expect(decrypted).toBe(password);
    });

    test("decrypt must fail with modified ciphertext", () => {
        const encrypted = encrypt("Hello");

        encrypted.content = encrypted.content.slice(0, -4) + "abcd";

        expect(() => decrypt(encrypted)).toThrow();
    });
})
