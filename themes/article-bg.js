(function () {
  
  require("IGCMS", function () {
    var preview = document.body.getAttribute("data-og-image").replace("/preview/", "/")
    if (!preview) {
      return;
    }
    IGCMS.appendStyle(".hdesc:before { background-image: url('" + preview + "'); }")
  })
  
})()