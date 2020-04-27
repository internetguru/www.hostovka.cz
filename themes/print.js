(() => {
  let printButtons = document.querySelectorAll(".button__print")
  printButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      window.print()
      event.preventDefault()
    })
  })
})()
