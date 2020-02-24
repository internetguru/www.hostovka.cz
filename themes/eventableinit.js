require("IGCMS.Eventable", function () {
  require("IGCMS.Moreable", function () {
    IGCMS.Eventable.init({
      debug: document.cookie.match(/^(.*;)?\s*PHPSESSID\s*=\s*[^;]+(.*)?$/)
    });
  })
})

