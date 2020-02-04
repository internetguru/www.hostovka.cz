(function() {
  require("IGCMS.Completable", function() {
    IGCMS.Completable.init({
      selectSelector: '#header select.completable',
      label: "",
      placeholder: "Co Vás zajímá? (Ctrl+Shift+F)",
      defaultChangeText: "Změnit filtr",
      filterSelector: ".filter",
      sendFormText: "Hledat na Google",
      sendFormClass: "google",
      keyboardShortcut: "ctrl+shift+f"
    })
  })
})()
