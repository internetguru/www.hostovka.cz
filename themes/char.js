(function(win) {
  let ul = document.querySelector('ul.vsechny_clanky')
  let lastChar = '-1'
  let chars = []
  Array.from(ul.children).forEach((item) => {
    const char = item.innerText.charAt(0).toUpperCase()
    if (char == lastChar) {
      return
    }
    let elm = document.createElement('li')
    elm.innerText = char
    elm.id = char
    elm.className = 'first-char'
    item.parentNode.insertBefore(elm, item)
    lastChar = char
    chars.push(char)
  })
  let wrapper = document.createElement('div')
  wrapper.className = 'chars'
  chars.forEach((item) => {
    let a = document.createElement('a')
    a.href = `#${item}`
    a.innerText = item
    wrapper.appendChild(a)
  })
  ul.parentNode.insertBefore(wrapper, ul)
  wrapper2 = wrapper.cloneNode(true)
  ul.parentNode.insertBefore(wrapper2, ul.nextElementSibling)
})(window)
