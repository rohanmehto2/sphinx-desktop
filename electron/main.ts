import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

const Configstore = require('configstore');
const conf = new Configstore('sphinx-cli');

const keytar = require('keytar');
const os = require('os');

let win: BrowserWindow;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#312450',
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `../../dist/index.html`),
            protocol: 'file:',
            slashes: true,
        })
    );

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}


app.on('ready', createWindow);

// on macOS, closing the window doesn't quit the app
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('getConfig', (event, arg) => {
    const config = {
        email: conf.get('sphinx.email'),
        baseApi: conf.get('sphinx.baseApi'),
        jwtPublicKey: conf.get('sphinx.jwtPublicKey')
    };
    win.webContents.send('getConfigResponse', config);
});

ipcMain.on('setConfig', (event, arg) => {
    conf.set('sphinx', arg);
    win.webContents.send('setConfigResponse', arg);
});

ipcMain.on('getKeychainSecret', async (event, arg) => {
    const keytarAccount = os.userInfo().username;
    const secret = await keytar.getPassword(arg, keytarAccount);
    win.webContents.send('getKeychainSecretResponse', secret);
});

ipcMain.on('setKeychainSecret', async (event, arg) => {
    const keytarAccount = os.userInfo().username;
    if (arg.value == null) {
        await keytar.deletePassword(arg.name, keytarAccount);
    } else {
        await keytar.setPassword(arg.name, keytarAccount, arg.value);
    }
    win.webContents.send('setKeychainSecretResponse', arg.value);
});
