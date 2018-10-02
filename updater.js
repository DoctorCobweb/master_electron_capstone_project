const { dialog, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')

// enable loggin
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

autoUpdater.autoDownload = false

// check for updates
module.exports.check = () => {
  autoUpdater.checkForUpdates()

  // listen for download (update found)
  autoUpdater.on('update-available', () => {

    // track progress percent
    let downloadProgress = 0

    // prompt user to update
    dialog.showMessageBox({
      type: 'info',
      title: 'update available',
      message: 'a new version of read-it is available. do you want to update now?',
      buttons: ['update', 'no']
    }, (buttonIdx) => {
      
      // not not 'update' button, return
      if (buttonIdx !== 0) return

      // else start download and show download progress in new windo
      autoUpdater.downloadUpdate()

      // create progress window
      let progressWin = new BrowserWindow({
        width: 350,
        height: 35,
        useContentSize: true,
        autoHideMenuBar: true,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        resizable: false
      })

      // load progress HTML
      progressWin.loadURL(`file://${__dirname}/renderer/progress.html`)

      // handle win close
      progressWin.on('closed', () => {
        progressWin = null
      })

      // listen for progress request from progressWin
      ipcMain.on('download-progress-request', (event) => {
        event.returnValue = downloadProgress
      })

      // track download progress on autoUpdater
      autoUpdater.on('download-progress', (dl) => {
        downloadProgresss = dl.percent
        autoUpdater.logger.info(downloadProgress)
      })

      // listen for completed update download
      autoUpdater.on('update-downloaded', () => {
        // close progressWin
        if(progressWin) progressWin.close()

        // prompt user to quit and install update
        dialog.showMessageBox({
          type: 'info',
          title: 'update ready',
          message: 'a new version of read-it is ready. quit and install now',
          buttons: ['yes', 'later']
        }, (buttonIdx) => {

          // update if 'yes'
          if (buttonIdx === 0) autoUpdater.quitAndInstall()
        })
      })
    })
  })
}