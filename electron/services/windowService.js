const { BrowserWindow, app } = require('electron');
const path = require('path');

function createMainWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    if (app.isPackaged) {
        win.loadFile(path.join(process.cwd(), 'dist/index.html'));
    } else {
        win.loadURL('http://localhost:5173');
    }

    return win;
}

module.exports = { createMainWindow };
