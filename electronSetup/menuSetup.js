const { Menu } = require('electron');

const mainMenuTemplate = [
  {
    label: 'Context',
    submenu: [
      {
        label: 'Unknown'
      }
    ]
  }
];

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle',
        accelerator: 'F12',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}

const createMenu = () => {
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

module.exports = {
  createMenu
}