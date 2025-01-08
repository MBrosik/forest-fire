const { app, BrowserWindow } = require('electron');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// enable live-reload of the electron app in development mode
const electronReload = require('electron-reload');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  switch (process.env.MODE) {
    case 'production':
      console.log('Starting app from a production build in the "dist" directory');
      mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
      break;
    case 'development':
      console.log('Starting app as a development server on PORT: 8080 - app window will open shortly');
      mainWindow.loadURL('http://localhost:8080/index.html');
      mainWindow.webContents.openDevTools();
      break;
    default:
      console.error(`Unknown run mode specified: ${process.env.MODE}`);
      break;
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
