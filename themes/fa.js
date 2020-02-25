FontAwesomeConfig = {
  observeMutations: true
};

(function() {
    var icons = document.querySelectorAll('*[class*="fa-"]')
    for (var i = 0; i < icons.length; i++) {
      icons[i].innerHTML = ""
    }
    var script = document.createElement("script")
    script.type = "text/javascript"
    //script.setAttribute("data-search-pseudo-elements", "")
    //script.setAttribute("observeMutations", "false")
    script.src = "https://kit.fontawesome.com/b0c4047774.js"
    document.head.appendChild(script)
})()
