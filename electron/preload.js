const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    register: (data) => ipcRenderer.invoke('register', data),
    login: (data) => ipcRenderer.invoke('login', data),
    addPassword: (data) => ipcRenderer.send('add-password', data),
    updatePassword: (data) => ipcRenderer.send('update-password', data),
    deletePassword: (id) => ipcRenderer.send('delete-password', id),
    getPasswords: () => ipcRenderer.send('get-passwords'),
    receivePasswords: (func) => ipcRenderer.on('passwords', (event, data) => func(data))
});
