(function () {
  
  require("IGCMS", function () {
    var preview = document.body.getAttribute("data-preview").replace("/preview/", "/")
    if (!preview) {
      return;
    }
    IGCMS.appendStyle(".hdesc:before { background-image: url('" + preview + "'); }")
  })
  
})()