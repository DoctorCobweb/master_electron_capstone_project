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

// open item for reading
exports.openItem = () => {

  //only if items have been add
  if(!this.toReadItems.length) return

  // get selected item
  let targetItem = $('.read-item.is-active')

  // get item's content url
  let contentURL = targetItem.data('url')

  console.log('opening item')
  console.log(contentURL)
}

// add new item
exports.addItem = (item) => {

  // hide 'no items' message
  $('#no-items').hide()

  // new item html, a bulma panel block
  let itemHTML = `<a class="panel-block read-item" data-url="${item.url}">
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
    .on('dblclick', this.openItem)
}