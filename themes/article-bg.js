(function () {
  
  require("IGCMS", function () {
    var general = document.body.getAttribute("data-image").replace("/preview/", "/")
    if (!general) {
      return;
    }
    IGCMS.appendStyle(".hdesc:before { background-image: url('" + general + "') !important; }")
  })
  
})()