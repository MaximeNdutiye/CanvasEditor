const {app, BrowserWindow, globalShortcut} = require('electron');
const url = require('url');
const electron = require('electron')
const domify = require('domify')

//hander for when the electron app is ready
function start(){

  const {width, height} =
    electron.screen.getPrimaryDisplay().workAreaSize;

  //Actual App
  var win = new BrowserWindow({
    width:  width * 2/3,
    height: height * 2/3,
    backgroundColor: '#292c34',
    frame: false
  });
  win.setMenuBarVisibility(false)

  win.loadURL(`file://${__dirname}/videoRecorder.html`)
  win.show();

  win.on('closed', _ => {
   win = null;
 });
}

app.on('ready', start);
