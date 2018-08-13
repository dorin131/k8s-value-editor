require('./events/mainEvents');
const { createMenu } = require('./electronSetup/menuSetup');
const { createWindow } = require('./electronSetup/windowSetup')
const { app } = require('electron');

app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
