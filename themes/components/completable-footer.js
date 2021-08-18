require("IGCMS.Completable", () => {
  IGCMS.Completable.init({
    selectSelector: '.file-list select[name="Admin"]',
    placeholder: "Select file (Ctrl+Shift+E)",
    label: "",
    keyboardShortcut: "ctrl+shift+e",
    appendValue: true,
    decorateListItem: (itemValue) => {
      return itemValue
        .replace("#default", "<span class='file-list__flag--default'>#default</span>")
        .replace("#user", "<span class='file-list__flag--user'>#user</span>")
        .replace("#admin", "<span class='file-list__flag--admin'>#admin</span>")
        .replace("#disabled", "<span class='file-list__flag--disabled'>#disabled</span>")
        .replace(/([^ ]+)$/, "</br><span class='file-list__flag--secondary'>$1</span>")
    },
  })
})
