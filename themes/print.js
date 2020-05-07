(() => {
  let printButtons = document.querySelectorAll(".button__print")
  printButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      window.print()
      event.preventDefault()
    })
  })
  window.addEventListener("beforeprint", (event) => {
    try {
      require("IGCMS.Eventable", () => {
        IGCMS.Eventable.sendGAEvent("print", "1", "1")
      })
    } catch (exception) {}
  })
})()
