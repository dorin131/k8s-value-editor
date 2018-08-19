// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {
  getContexts,
  getCurrentContext,
  getDeployments,
  setContext,
  getValues,
  saveValuesToFile,
  getDiff,
  upgrade
} = require('./events/rendererEvents');
const { remote } = require('electron');

const contexts = [];
const deployments = [];
const currentContext = {
  text: ''
};
const currentDeployment = {
  text: ''
};
const currentValues = {
  text: ''
};
const chartPath = {
  text: ''
};
const checkedDiff = {
  value: false
};

const diffDialog = (diff) => remote.dialog.showMessageBox({
  type: 'info',
  title: 'Diff',
  message: diff || 'No differences found',
  buttons: ['OK']
});

const upgradeSuccessDialog = () => remote.dialog.showMessageBox({
  type: 'info',
  title: 'Upgrade',
  message: 'Success',
  buttons: ['OK']
});

const upgradeErrorDialog = (error) => remote.dialog.showMessageBox({
  type: 'error',
  title: 'Upgrade',
  message: 'Failed',
  buttons: ['OK']
});

const onPathChoose = () => {
  const [path] = remote.dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  chartPath.text = path;
};

const onDiffClick = () => {
  saveValuesToFile(currentValues.text)
  .then(() => getDiff(currentDeployment.text, chartPath.text))
  .then(diffDialog);
  checkedDiff.value = true;
};

const onUpgradeClick = () => {
  remote.dialog.showMessageBox({
    type: 'warning',
    title: 'Please confirm',
    message: 'Are you sure you want to apply the changes to ' + currentDeployment.text + ' on ' + currentContext.text,
    buttons: ['Yes', 'No']
  }, (res) => {
    if (res === 0) {
      upgrade().then(upgradeSuccessDialog).catch(upgradeErrorDialog);
    }
  });
}

const onContextClick = (ctx) => {
  while (deployments.length) deployments.pop();
  currentContext.text = ctx;
  currentDeployment.text = '';
  currentValues.text = '';
  setContext(ctx)
  .then(() => getDeployments())
  .then(res => deployments.push(...res));
};

const onDeploymentClick = (deployment) => {
  currentValues.text = '';
  currentDeployment.text = deployment;
  chartPath.text = '';
  getValues(deployment).then(res => {
    currentValues.text = res
  });
};

new Vue({
  el: "#contexts",
  data: { contexts, currentContext, onContextClick }
});

new Vue({
  el: "#deployments",
  data: { deployments, currentDeployment, onDeploymentClick }
});

new Vue({
  el: "#current-values",
  data: { currentValues, currentDeployment, chartPath, checkedDiff, onDiffClick, onPathChoose, onUpgradeClick }
});


Promise.all([getContexts(), getCurrentContext(), getDeployments()])
.then((res) => {
  contexts.push(...res[0]);
  currentContext.text = res[1];
  deployments.push(...res[2])
});