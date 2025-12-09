const { app, ipcMain } = require('electron');
const { createMainWindow } = require('./services/windowService');
const { registerUser, loginUser } = require('./services/authService');
const {
    sendPasswords,
    addPassword,
    updatePassword,
    deletePassword
} = require('./services/passwordService');

let currentUser = null;

app.whenReady().then(() => {
    const win = createMainWindow();

    // --- AUTH ---
    ipcMain.handle('register', (event, data) => registerUser(data));
    ipcMain.handle('login', async (event, data) => {
        const result = await loginUser(data);
        if (result.success) currentUser = result.user;
        return result;
    });

    // --- PASSWORD CRUD ---
    ipcMain.on('get-passwords', (event) => sendPasswords(event, currentUser));
    ipcMain.on('add-password', (event, data) => addPassword(event, data, currentUser));
    ipcMain.on('update-password', (event, data) => updatePassword(event, data, currentUser));
    ipcMain.on('delete-password', (event, id) => deletePassword(event, id, currentUser));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
