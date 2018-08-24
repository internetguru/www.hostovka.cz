require("IGCMS.Eventable", function () {
  if (typeof ga === "function" || IGCMS.Eventable.debug) {
    IGCMS.Eventable.init({
      debug: true
    });
  }
})