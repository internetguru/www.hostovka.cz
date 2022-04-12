(function(win) {
  let ul = document.querySelector('ul.vsechny_clanky')
  let lastChar = '-1'
  let chars = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  let usedChars = []
  Array.from(ul.children).forEach((item) => {
    const char = item.innerText.charAt(0).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (char == lastChar) {
      return
    }
    if (!char.match(/^[A-ZĚŠČŘŽÝÁÍÉÚŮŤŇĎ]$/)) {
      return
    }
    let elm = document.createElement('li')
    elm.innerText = char
    elm.id = char
    elm.className = 'first-char'
    item.parentNode.insertBefore(elm, item)
    lastChar = char
    usedChars.push(char)
  })
  let wrapper = document.createElement('div')
  wrapper.className = 'chars'
  chars.forEach((item) => {
    let a = document.createElement('a')
    if (usedChars.includes(item)) {
      a.href = `#${item}`
    } else {
      a.href = `#`
    }
    a.innerText = item
    wrapper.appendChild(a)
  })
  ul.parentNode.insertBefore(wrapper, ul)
  wrapper2 = wrapper.cloneNode(true)
  ul.parentNode.insertBefore(wrapper2, ul.nextElementSibling)
})(window)
