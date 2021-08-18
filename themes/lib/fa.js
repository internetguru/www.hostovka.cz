(() => {
  let icons = document.querySelectorAll('*[class*="fa-"]')
  for (let i = 0; i < icons.length; i++) {
    icons[i].innerHTML = ""
  }
})()
