const { app, BrowserWindow, Menu } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
  })
  Menu.setApplicationMenu(null)

  win.loadURL('http://localhost:3000')
}

app.on('ready', createWindow)
