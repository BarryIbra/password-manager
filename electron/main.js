const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const pool = require('./db');
const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require('./cryptoUtils');


let currentUser = null;

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    if (app.isPackaged) {
        win.loadFile(path.join(process.cwd(), 'dist/index.html'))
    } else {
        win.loadURL('http://localhost:5173')
    }
}

app.whenReady().then(() => {
    // ---------- Gestion utilisateurs ----------
    ipcMain.handle('register', async (event, { username, password }) => {
        const hashed = await bcrypt.hash(password, 10);
        try {
            await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashed]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('login', async (event, { username, password }) => {
        const res = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
        if (res.rows.length === 0) return { success: false, error: 'Utilisateur inconnu' };
        const user = res.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return { success: false, error: 'Mot de passe incorrect' };
        currentUser = user;
        return { success: true, user: { id: user.id, username: user.username } };
    });


    createWindow();

}

);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});





// ---------- Gestion mots de passe ----------
async function sendPasswords(event) {
    if (!currentUser) return;
    const res = await pool.query('SELECT * FROM passwords WHERE user_id=$1', [currentUser.id]);
    const decrypted = res.rows.map(p => {
        return {
            id: p.id,
            name: p.name,
            username: p.username,
            password: decrypt({
                iv: p.iv,
                tag: p.tag,
                content: p.password
            })
        };
    });

    event.sender.send('passwords', decrypted);

}

ipcMain.on('add-password', async (event, { name, username, password }) => {
    if (!currentUser) return;
    const encrypted = encrypt(password);
    await pool.query(
        'INSERT INTO passwords (user_id, name, username, iv, tag, password) VALUES ($1, $2, $3, $4, $5, $6)',
        [currentUser.id, name, username, encrypted.iv, encrypted.tag, encrypted.content]
    );

    sendPasswords(event);
});

ipcMain.on('update-password', async (event, { id, name, username, password }) => {
    if (!currentUser) return;
    const encrypted = encrypt(password);
    await pool.query(
        'UPDATE passwords SET name=$1, username=$2, iv=$3, tag=$4, password=$5 WHERE id=$6 AND user_id=$7',
        [name, username, encrypted.iv, encrypted.tag, encrypted.content, id, currentUser.id]
    );

    sendPasswords(event);
});

ipcMain.on('delete-password', async (event, id) => {
    if (!currentUser) return;
    await pool.query('DELETE FROM passwords WHERE id=$1 AND user_id=$2', [id, currentUser.id]);
    sendPasswords(event);
});

ipcMain.on('get-passwords', (event) => {
    sendPasswords(event);
});
