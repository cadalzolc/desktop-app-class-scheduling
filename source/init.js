const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({ width: 800, height: 600, icon: "C:\Users\VocalAlloy\Downloads\School\Capstone\dotSystems-1.42069\build\icon.ico" })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.on('ready', createWindow)