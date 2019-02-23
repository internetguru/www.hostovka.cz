(function() {
  require("IGCMS.Completable", function() {
    IGCMS.Completable.init({
      selectSelector: '#header select.completable',
      placeholder: "Filtrovat články (Ctrl+Shift+F)",
      defaultChangeText: "Změnit filtr",
      filterSelector: ".filter",
      sendFormText: "Hledat na Google",
      sendFormClass: "google",
      keyboardShortcut: "ctrl+shift+f"
    })
  })
})()
