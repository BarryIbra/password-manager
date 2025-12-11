let users = [];
let passwords = [];

let userIdCounter = 1;
let pwdIdCounter = 1;

function reset() {
    users = [];
    passwords = [];
    userIdCounter = 1;
    pwdIdCounter = 1;
}

module.exports = {
    __reset: reset,

    async query(sql, params) {
        sql = sql.trim().toLowerCase();

        // ---- USERS ----
        if (sql.startsWith('insert into users')) {
            const [username, password] = params;
            const newUser = { id: userIdCounter++, username, password };
            users.push(newUser);
            return { rows: [newUser] };
        }

        // ---- PASSWORDS INSERT ----
        if (sql.startsWith('insert into passwords')) {
            const [user_id, name, username, iv, tag, password] = params;
            const row = {
                id: pwdIdCounter++,
                user_id,
                name,
                username,
                iv,
                tag,
                password
            };
            passwords.push(row);
            return { rows: [row] };
        }

        // ---- PASSWORDS SELECT ----
        if (sql.startsWith('select')) {
            const id = params[0];
            return { rows: passwords.filter(p => p.id === id) };
        }

        // ---- UPDATE ----
        if (sql.startsWith('update')) {
            const [iv, tag, password, id] = params;
            const row = passwords.find(p => p.id === id);
            if (row) {
                row.iv = iv;
                row.tag = tag;
                row.password = password;
            }
            return { rows: [] };
        }

        // ---- DELETE ----
        if (sql.startsWith('delete')) {
            const id = params[0];
            passwords = passwords.filter(p => p.id !== id);
            return { rows: [] };
        }

        return { rows: [] };
    },

    async end() { }
};

// Fake in-memory DB
let fakeUsers = [];

// Reset between tests
function __reset() {
    fakeUsers = [];
}

module.exports = {
    __reset,
    async query(sql, params) {
        // INSERT user
        if (sql.startsWith("INSERT INTO users")) {
            const [username, hashedPassword] = params;

            // Simulate UNIQUE constraint
            if (fakeUsers.some(u => u.username === username)) {
                throw new Error("duplicate key value violates unique constraint");
            }

            const newUser = {
                id: fakeUsers.length + 1,
                username,
                password: hashedPassword
            };

            fakeUsers.push(newUser);

            return { rows: [{ id: newUser.id }] };
        }

        // SELECT user by username
        if (sql.startsWith("SELECT * FROM users WHERE username=")) {
            const username = params[0];
            const found = fakeUsers.filter(u => u.username === username);
            return { rows: found };
        }

        throw new Error("SQL query not mocked: " + sql);
    }
};

