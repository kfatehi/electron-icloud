const {app, BrowserWindow, ipcMain} = require('electron')
const { capcombine, caphandler } = require('./caputil');
const path = require('path');

const FMF = require('./fmf');

const apps = [
  new FMF()
]

app.on('ready', () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      partition: 'persist:icloud',
      sandbox: true,
      preload: path.join(__dirname,'preload.js')
    }
  })

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })

  win.loadURL('https://www.icloud.com#fmf')

  ipcMain.on('get-xhr-capture-config', (event) => {
    let list = capcombine(apps);
    event.returnValue = list;
  });

  ipcMain.on('xhr-captured', (event, data)=>{
    console.log('capped');
    apps.forEach((app)=> caphandler(app, data));
  })
});
