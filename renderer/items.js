// track items with array
exports.toReadItems = JSON.parse(localStorage.getItem('toReadItems')) || []

// save items to localstorage on the default session
exports.saveItems = () => {
  localStorage.setItem('toReadItems', JSON.stringify(this.toReadItems))
}

// toggle item as selected
exports.selectItem = (event) => {
  $('.read-item').removeClass('is-active')
  $(event.currentTarget).addClass('is-active')
}

exports.changeItem = (direction) => {
  // get current active item
  let activeItem = $('.read-item.is-active')

  // check direction and get next or previous read-item
  let newItem = (direction === 'down') ? activeItem.next('.read-item') : activeItem.prev('.read-item')

  // only if item exists, make selection change
  if (newItem.length) {
    activeItem.removeClass('is-active')
    newItem.addClass('is-active')
  }
}

// window function
// delete item by index
window.deleteItem = (idx = false) => {
  // console.log(idx)

  // set i to active item if not passed as argument
  // => this happens when 'delete item' is selected from
  // the app menu or using a keyboard shortcut
  if (idx === false) {
    idx = $('.read-item.is-active').index() - 1
  }

  // remove item from DOM
  $('.read-item').eq(idx).remove()

  // remove from toReadItems array
  this.toReadItems = this.toReadItems.filter((item, index) => {
    return index !== idx
  })

  // update storage
  this.saveItems()

  // select prev item or none if list is now empty
  if (this.toReadItems.length) {
    // if first item was deleted, select new first item in list, else previous item
    let newIndex = (idx === 0) ? 0 : idx - 1

    // assign active class to new index
    $('.read-item').eq(newIndex).addClass('is-active')
  } else {
    // else show 'no-items' message
    $('#no-items').show()
  }
}

// open item in default browser
window.openInBrowser = () => {

  // only if items exists
  if (!this.toReadItems.length ) return

  // get selected item
  let targetItem = $('.read-item.is-active')

  // open in browser
  require('electron').shell.openExternal(targetItem.data('url'))
}

// open item for reading
window.openItem = () => {

  //only if items have been add
  if(!this.toReadItems.length) return

  // get selected item
  let targetItem = $('.read-item.is-active')

  // get item's content url
  let contentURL = encodeURIComponent(targetItem.data('url'))

  // get item index to pass to proxy window
  let itemIndex = targetItem.index() - 1

  // console.log('opening item')
  // console.log(contentURL)

  // reader window URL
  let readerWinURL = `file://${__dirname}/reader.html?url=${contentURL}&itemIndex=${itemIndex}`
  // console.log(`${__dirname}`) // in renderer folder

  // open item in new proxy BrowserWindow
  let readerWin = window.open(readerWinURL, targetItem.data('title'))
}

// add new item
exports.addItem = (item) => {

  // hide 'no items' message
  $('#no-items').hide()

  // new item html, a bulma panel block
  let itemHTML = `<a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
                    <figure class="image has-shadow is-64x64 thumb">
                      <img src="${item.screenshot}">
                    </figure>
                    <h2 class="title is-4 column">${item.title}</h2>
                  </a>`

  // append to read-list
  $('#read-list').append(itemHTML)

  // attach select event handler
  // => because we add listeners to all .read-item elems each
  // time a single item is added, we need to switch off any
  // previous listeners applied.
  // otherwise, we will keep accumulating more and more 
  // 'click' listeners (bad!)
  $('.read-item')
    .off('click, dblclick')
    .on('click', this.selectItem)
    .on('dblclick', window.openItem)
}