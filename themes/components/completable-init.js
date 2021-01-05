(() => {
  require("IGCMS.Completable", () => {
    document.body.insertAdjacentHTML('beforeend',  '<span data-fa-symbol="tag" class="fas fa-tag"></span><span data-fa-symbol="doc" class="far fa-file-alt"></span>')
    IGCMS.Completable.init({
      selectSelector: '#header select.completable',
      placeholder: "Co Vás zajímá? (Ctrl+Shift+F)",
      defaultChangeText: "Vyhledat",
      // filterSelector: ".filter",
      sendFormText: "Hledat na Google",
      sendFormClass: "google",
      keyboardShortcut: "ctrl+shift+f",
      label: "",
      submitOnClick: true,
      decorateListItem: (itemValue) => {
        return itemValue
          .replace(/(.*\d+ výskyt(?:ů|y).*)/, "<svg class='svg-inline--fa fa-w-14'><use xlink:href='#tag'></use></svg>$1")
          .replace(/(^[^<]+$)/, "<svg class='svg-inline--fa fa-w-14'><use xlink:href='#doc'></use></svg>$1")
          .replace(/ - (.*)$/, "</br><span class='fp-secondary'>$1</span>")
      },
      onSend: (navig, currentFile, closeNavig) => {
        closeNavig()
        let path = ""
        if (/^stitky/.test(currentFile.value)) {
          const label = currentFile.value.match(/(stitky\/)(.*)/)[2]
          path = "/?usp=navigjs&stitek=" + label + "#clanky"
        } else if (/^clanky/.test(currentFile.value)) {
          const article = currentFile.value.match(/(clanky\/)(.*)/)[2]
          path = "/" + article + "?usp=navigjs"
        } else {
          path = "https://www.google.com/search?sitesearch=www.hostovka.cz&amp;q=" + currentFile.value
        }
        console.log(path)
        window.location = path        
      },
      sendForm: false
    })
  })
})()

