(function () {
  
  require("IGCMS", function () {
    var general = document.body.getAttribute("data-image").replace("/preview/", "/")
    if (!general) {
      return;
    }
    IGCMS.appendStyle(":root { --hdesc-top-bg: url('/" + general.replace(/^\/+/g,'') + "') !important; }")
  })
  
})()