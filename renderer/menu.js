// modules
const { remote, shell } = require('electron')

// menu template object
const template = [
  {
    label: 'items',
    submenu: [
      {
        label: 'add new',
        accelerator: 'CmdOrCtrl+O',
        click () { $('.open-add-modal').click()}
      },
      {
        label: 'read item',
        accelerator: 'CmdOrCtrl+Enter',
        click () { window.openItem() }
      },
      {
        label: 'delete item',
        accelerator: 'CmdOrCtrl+Backspace',
        click () { window.deleteItem() }
      },
      {
        label: 'open in browser',
        accelerator: 'CmdOrCtrl+Shift+Enter',
        click () { window.openInBrowser() }
      },
      {
        type: 'separator',
      },
      {
        label: 'search items',
        accelerator: 'CmdOrCtrl+S',
        click () { $('#search').focus() }
      }
    ]
  },
  {
    label: 'edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        role: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'learn more',
        click() { shell.openExternal('https://google.com') }
      }
    ]
  }
]

// mac specific
if (process.platform === 'darwin') {

  // add first menu item
  template.unshift({
    label: remote.app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })

  // mac extra window options
  // => it's now at index 3 because we have 
  // used unshift on the template to insert the immediate
  // stuff above to the front of the array.
  template[3].submenu = [
    {
      label: 'close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'bring all to front',
      role: 'front'
    }
  ]
}

// add menu to app
const menu = remote.Menu.buildFromTemplate(template)
remote.Menu.setApplicationMenu(menu)