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
