const { ipcRenderer } = require('electron');

const getContexts = () => {
  return new Promise((resolve) => {
    ipcRenderer.send('get-contexts');
    ipcRenderer.on('contexts', (error, values) => {
      resolve(values.filter(Boolean).map((text) => ({ text })));
    });
  });
};

const getCurrentContext = () => {
  return new Promise((resolve) => {
    ipcRenderer.send('get-current-context');
    ipcRenderer.on('current-context', (error, value) => {
      resolve(value);
    });
  });
};

const getDeployments = () => {
  return new Promise((resolve) => {
    ipcRenderer.send('get-deployments');
    ipcRenderer.on('deployments', (error, values) => {
      resolve(values.filter(Boolean).map((text) => ({ text })));
    });
  });
};

const getValues = (deployment) => {
  return new Promise((resolve) => {
    ipcRenderer.send('get-values', deployment);
    ipcRenderer.on('values', (error, value) => {
      resolve(value);
    });
  });
};

const setContext = (deployment) => {
  return new Promise((resolve) => {
    ipcRenderer.send('set-context', deployment);
    ipcRenderer.on('context-set', (error, value) => {
      resolve();
    });
  });
};

const saveValuesToFile = (values) => {
  return new Promise((resolve) => {
    ipcRenderer.send('save-values', values);
    ipcRenderer.on('values-saved', (error, value) => {
      resolve();
    });
  });
};

const getDiff = (deployment, path) => {
  return new Promise((resolve) => {
    ipcRenderer.send('get-diff', deployment, path);
    ipcRenderer.on('diff', (error, value) => {
      resolve(value);
    });
  });
};

const upgrade = (deployment, path) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('upgrade', deployment, path);
    ipcRenderer.on('upgraded', (error, value) => {
      resolve(value);
    });
  });
};

module.exports = {
  getContexts,
  getCurrentContext,
  getDeployments,
  getValues,
  setContext,
  saveValuesToFile,
  getDiff,
  upgrade
}