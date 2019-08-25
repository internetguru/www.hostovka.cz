require("IGCMS.Eventable", function () {
  require("IGCMS.Moreable", function () {
    IGCMS.Eventable.init({
      debug: typeof ga !== "function"
    });
  })
})

