const { encrypt, decrypt } = require('../cryptoUtils');

describe('CryptoUtils AES-256-GCM', () => {
    const testPassword = 'MotDePasseSuperSecret123!';

    test('should encrypt and decrypt correctly', () => {
        const encrypted = encrypt(testPassword);
        expect(encrypted).toHaveProperty('iv');
        expect(encrypted).toHaveProperty('tag');
        expect(encrypted).toHaveProperty('content');

        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(testPassword);
    });

    test('decrypting with modified content should fail', () => {
        const encrypted = encrypt(testPassword);
        encrypted.content = encrypted.content.slice(0, -2) + 'AA'; // corruption
        expect(() => decrypt(encrypted)).toThrow();
    });
});
