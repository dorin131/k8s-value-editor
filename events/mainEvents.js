const { ipcMain } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');

ipcMain.on('get-values', (event, deployment) => {
  exec('helm get values ' + deployment, (err, stdout, stderr) => {
    event.sender.send('values', stdout.toString());
  })
})

ipcMain.on('get-contexts', (event, arg) => {
  exec('kubectl config get-contexts | tr -s \' \' | cut -d \' \' -f2 | sed 1d', (err, stdout, stderr) => {
    event.sender.send('contexts', stdout.toString().split('\n'));
  })
})

ipcMain.on('get-current-context', (event, arg) => {
  exec('kubectl config current-context', (err, stdout, stderr) => {
    event.sender.send('current-context', stdout.toString().split('\n')[0]);
  })
})

ipcMain.on('get-deployments', (event, arg) => {
  exec('helm list | tr -s \' \' | cut -d \' \' -f1 | sed 1d', (err, stdout, stderr) => {
    event.sender.send('deployments', stdout.toString().split('\n'));
  })
})

ipcMain.on('set-context', (event, context) => {
  exec('kubectl config use-context ' + context, (err, stdout, stderr) => {
    event.sender.send('context-set');
  })
})

ipcMain.on('save-values', (event, values) => {
  fs.writeFile('custom_values.yaml', values, (err) => {
    if (err) throw err;
    event.sender.send('values-saved');
  });
})

ipcMain.on('get-diff', (event, deployment, path) => {
  exec('helm diff upgrade ' + deployment + ' ' + path + ' -f custom_values.yaml', (err, stdout, stderr) => {
    event.sender.send('diff', stdout.toString());
  })
})

ipcMain.on('upgrade', (event, deployment, path) => {
  exec('helm upgrade ' + deployment + ' ' + path + ' -f custom_values.yaml', (err, stdout, stderr) => {
    event.sender.send('upgraded', stdout.toString());
  })
})