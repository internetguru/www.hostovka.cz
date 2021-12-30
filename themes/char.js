(function(win) {
  let ul = document.querySelector('ul.vsechny_clanky')
  let lastChar = '-1'
  Array.from(ul.children).forEach((item) => {
    const char = item.innerText.charAt(0).toUpperCase()
    if (char == lastChar) {
      return
    }
    let elm = document.createElement('li')
    elm.innerText = char
    elm.className = 'first-char'
    item.parentNode.insertBefore(elm, item)
    lastChar = char
  })
})(window)
