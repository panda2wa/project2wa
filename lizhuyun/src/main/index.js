// 'use strict'
import { app, BrowserWindow, screen } from 'electron'
import { autoUpdater } from 'electron-updater'
const { spawn } = require('child_process')
const { ipcMain } = require('electron')
ipcMain.on('app-child', (e, appUrl) => {
  spawn(appUrl)
})
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let statusWinSize = true
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  const size = screen.getPrimaryDisplay().workAreaSize
  const widW = size.width
  const winH = size.height
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: winH,
    useContentSize: true,
    width: widW,
    frame: false,
    resizable: false,
    icon: 'icon.ico',
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      webSecurity: false,
      plugins: true,
      nodeIntegration: true // 是否集成 Nodejs
    }
  })

  mainWindow.loadURL(winURL)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.once('devtools-opened', () => {
        mainWindow.focus()
      })
      mainWindow.webContents.openDevTools()
    })
  }
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
let zhy = {
  zzhTitle: '测试版(v0.0.001)', // 演示版：演示版(v0.4.0)、测试版：测试版(v0.4.0)、正式版："";测试版(v1.5.0)
  timeOut: 20000,
  // 正式URL
    hostName: '221.10.254.184',
    hostPort: '8020',
    // 视频文件地址
    videoName: '47.108.181.123',
    videoPort: '8123',
    // 扬尘地址
    yangchenName: '221.10.254.184',
    yangchenPort: '8021',
    // 图片文件地址
    imgName: '221.10.254.184',
    imgPort: '8099'
  // 广安测试URL
    // hostName: '101.207.139.194',
    // hostPort: '8020',
    // // 扬尘接口
    // yangchenName: '192.168.1.183',
    // yangchenPort: '9008',
    // // 视频文件地址
    // videoName: '192.168.1.183',
    // videoPort: '8123',
    // // 图片文件地址
    // imgName: '101.207.139.194',
    // imgPort: '6683'
}
// 获取域名，端口
global.sharedObject = {
  domainName: zhy.hostName,
  portNumber: zhy.hostPort,
  videoName: zhy.videoName,
  videoPort: zhy.videoPort,
  yangchenName: zhy.yangchenName,
  yangchenPort: zhy.yangchenPort,
  imgName: zhy.imgName,
  imgPort: zhy.imgPort,
  filePath: app.getPath('module'),
  zzhTitle: zhy.zzhTitle
}

try {
  app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'))
  app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.403')
} catch (error) {
  global.sharedObject.isDownloadFlash = true
}
/*
 *
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
;(function () {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  }
  // const uploadUrl = "http://221.10.254.184:8090"; // 下载地址，不加后面的**.exe（正式版更新路径）
  // const uploadUrl = "http://101.207.139.194:8013"; // 下载地址，不加后面的**.exe（演示版更新路径）
  // const uploadUrl = "http://101.207.139.194:8014"; // 下载地址，不加后面的**.exe（演示版更新路径）
  const uploadUrl = 'http://192.168.1.183:9080' // 下载地址，不加后面的**.exe（测试版更新路径）
  autoUpdater.setFeedURL(uploadUrl)
  autoUpdater.on('error', function (error) {
    console.log(error)
    sendUpdateMessage(message.error)
  })
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  })
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  })
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    ipcMain.on('isUpdateNow', (e, arg) => {
      // some code here to handle event
      autoUpdater.quitAndInstall()
    })

    mainWindow.webContents.send('isUpdateNow')
  })

  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })
}())

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage (text) {
  mainWindow.webContents.send('message', text)
}
// 窗口缩放
ipcMain.on('window-zoom', (e, arg) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.minimize()
    e.sender.send('errorDataWindowsClose', true)
  }
})
ipcMain.on('windows-open', (e, arg) => {
  mainWindow.unmaximize()
  mainWindow.show()
  e.sender.send('errorDataWindowsOpen', false)
})
// 改变窗口大小
ipcMain.on('window-change', (e, arg) => {
  if (!statusWinSize) {
    mainWindow.setFullScreen(true)
    mainWindow.center()
    statusWinSize = true
  } else {
    mainWindow.center()
    mainWindow.setFullScreen(false)
    statusWinSize = false
  }
})

// 窗口关闭
ipcMain.on('window-close', (e, arg) => {
  mainWindow.close()
})

ipcMain.on('window-size', (e, arg) => {
  mainWindow.setSize(arg.width, arg.height)
  mainWindow.center()
  statusWinSize = false
})
