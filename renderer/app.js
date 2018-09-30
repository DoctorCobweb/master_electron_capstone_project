// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// NOTES
// our application startup and user interaction logic

const { ipcRenderer } = require('electron')
const items = require('./items')
const menu = require('./menu')

// navigate selected item with up/down keys
$(document).keydown((event) => {

  switch(event.key) {
    case 'ArrowUp':
      items.changeItem('up')
      break;
    case 'ArrowDown':
      items.changeItem('down')
      break;
  }
})

//show add-modal
$('.open-add-modal').click(() => {
  $('#add-modal').addClass('is-active')
})

// hide add-modal
$('.close-add-modal').click(() => {
  $('#add-modal').removeClass('is-active')
})

// handle add-modal submission
$('#add-button').click(() => {

  // get URL from input
  let newItemURL = $('#item-input').val()
  if (newItemURL) {

    // disable module UI
    $('#item-input').prop('disabled', true)
    $('#add-button').addClass('is-loading')
    $('.close-add-modal').addClass('is-disabled')

    // send URL to main process via IPC
    ipcRenderer.send('new-item', newItemURL)
  }
})

// listen for new item from main
ipcRenderer.on('new-item-success', (event, item) => {
  // console.log(item)

  // add item to items array
  items.toReadItems.push(item)

  //save item
  items.saveItems()

  // add item
  items.addItem(item)

  //close and reset the modal
  $('#add-modal').removeClass('is-active')
  $('#item-input').prop('disabled', false).val('')
  $('#add-button').removeClass('is-loading')
  $('.close-add-modal').removeClass('is-disabled')

  // if first item being added, select it
  if (items.toReadItems.length === 1) {
    $('.read-item:first()').addClass('is-active')
  }
})

// simulate add click on enter
$('#item-input').keyup((e) => {
  if (e.key === 'Enter') $('#add-button').click()
})

// filter items by title
$('#search').keyup((event) => {
  // get current #search input value
  let filter = $(event.currentTarget).val()
  console.log(filter)

  $('.read-item').each((idx, elem) => {
    $(elem).text()
      .toLowerCase()
      .includes(filter) ? $(elem).show() : $(elem).hide()
  })
})

// add items when app loads 
if (items.toReadItems.length) {
  items.toReadItems.forEach((items.addItem))
  $('.read-item:first()').addClass('is-active')
}