const {app, BrowserWindow, globalShortcut} = require('electron');
const url = require('url');
const electron = require('electron')

//hander for when the electron app is ready
function start(){

  const {width, height} =
    electron.screen.getPrimaryDisplay().workAreaSize;

  //Actual App
  var win = new BrowserWindow({
    width:  width * 2/3,
    height: height * 2/3,
    backgroundColor: '#292c34'
  });
  win.setMenuBarVisibility(false)

  win.loadURL(`file://${__dirname}/videoRecorder.html`)
  win.show();
}

app.on('ready', start);
