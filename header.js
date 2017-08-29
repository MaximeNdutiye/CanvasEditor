const {remote} = require('electron')
const domify = require('domify')

document.addEventListener('DOMContentLoaded', e => {



  document.getElementById('close').addEventListener('click', closewindow)
  document.getElementById('minimize').addEventListener('click', minimizewindow)
  document.getElementById('maximize').addEventListener('click', maximizewindow)

  function closewindow(){
    var window = remote.getCurrentWindow()
    window.close()
  }

  function minimizewindow(){
    var window = remote.getCurrentWindow()
    window.minimize()
  }

  function maximizewindow() {
    var window = remote.getCurrentWindow()
    window.isMaximized() ? window.unmaximize() : window.maximize()
  }
})
