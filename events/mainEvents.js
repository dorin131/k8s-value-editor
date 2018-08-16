const { ipcMain } = require('electron');
const { execFile } = require('child_process');
const fs = require('fs');

ipcMain.on('get-values', (event, deployment) => {
  execFile(process.env.SHELL, ['-i', '-c', 'helm get values ' + deployment], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    event.sender.send('values', stdout.toString());
  });
})

ipcMain.on('get-contexts', (event, arg) => {
  execFile(process.env.SHELL, ['-i', '-c', 'kubectl config get-contexts | tr -s \' \' | cut -d \' \' -f2 | sed 1d'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    event.sender.send('contexts', stdout.toString().trim().split('\n'));
  });
})

ipcMain.on('get-current-context', (event, arg) => {
  execFile(process.env.SHELL, ['-i', '-c', 'kubectl config current-context'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    event.sender.send('current-context', stdout.toString().split('\n')[0]);
  });
})

ipcMain.on('get-deployments', (event, arg) => {
  execFile(process.env.SHELL, ['-i', '-c', 'helm list | tr -s \' \' | cut -d \' \' -f1 | sed 1d'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    event.sender.send('deployments', stdout.toString().split('\n'));
  });
})

ipcMain.on('set-context', (event, context) => {
  execFile(process.env.SHELL, ['-i', '-c', 'kubectl config use-context ' + context], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    event.sender.send('context-set');
  });
})

ipcMain.on('get-diff', (event, deployment, path) => {
  execFile(process.env.SHELL, ['-i', '-c', 'helm diff upgrade ' + deployment + ' ' + path + ' -f custom_values.yaml'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    event.sender.send('diff', stdout.toString());
  });
})

ipcMain.on('upgrade', (event, deployment, path) => {
  execFile(process.env.SHELL, ['-i', '-c', 'helm upgrade ' + deployment + ' ' + path + ' -f custom_values.yaml'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    event.sender.send('upgraded', stdout.toString());
  });
})

ipcMain.on('save-values', (event, values) => {
  fs.writeFile('custom_values.yaml', values, (err) => {
    if (err) throw err;
    event.sender.send('values-saved');
  });
})