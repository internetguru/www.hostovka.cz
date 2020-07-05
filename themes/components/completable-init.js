(function () {
  require("IGCMS.Completable", function () {
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
      decorateListItem: function (itemValue) {
        return itemValue
          .replace(/(.*\d+ výskyt(?:ů|y).*)/, "<svg class='svg-inline--fa fa-w-14'><use xlink:href='#tag'></use></svg>$1")
          .replace(/(^[^<]+$)/, "<svg class='svg-inline--fa fa-w-14'><use xlink:href='#doc'></use></svg>$1")
          .replace(/ - (.*)$/, "</br><span class='fp-secondary'>$1</span>")
      },
    })
  })
})()

