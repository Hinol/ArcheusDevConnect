const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        icon: 'icon.ico',
        width: 1024,
        height: 768,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            
            
        },
    });

    mainWindow.loadFile('index.html');

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
