const { BrowserWindow } = require('electron')
let bgItemWin

// set the entire exports object to one thing, this func
module.exports = (url, callback) => {
  // create new offscreen BrowserWindo
  bgItemWin = new BrowserWindow({
    width: 1000,
    height: 1000,
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  // load the read item
  bgItemWin.loadURL(url)

  // wait for the page to finish loading
  bgItemWin.webContents.on('did-finish-load', () => {

    // get screenshot (thumbnail)
    bgItemWin.webContents.capturePage((image) => {

      // get image as dataURI
      let screenshot = image.toDataURL()

      // get page title
      let title = bgItemWin.getTitle()

      // return new item via callback
      callback({ title, screenshot, url })

      //clean up
      bgItemWin.close()
      bgItemWin = null
    })
  })
}