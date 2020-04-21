(function(){
  var descs = document.querySelectorAll('.clanek .desc');
  
  var fullDescs = [];
  
  var multiClickHandler = function (handlers, index, button) {
    var clicks = 0, timeout, index = index, button = button;
    return function (e) {
      clicks++;
      if (handlers[clicks]) {
        handlers[clicks](e, this, index, button)
      }
      clicks = 0;
    };
  }
   
  function shorten (str, maxLen, separator) {
    if (typeof separator === 'undefined') {
      separator = ' ';
    }
    var len = str.length;
    if (len <= maxLen) {
      return str;
    }
    var indexof = str.lastIndexOf(separator, maxLen);
    if (len - indexof < 50) {
      return str;
    }
    return str.substr(0, indexof) + '…';
  }
  
  for (var i = 0; i < descs.length; i++) {
    var button = document.createElement("a");
    var handler = multiClickHandler({
      1: function (e, target, index, button) {
        var parent = target.parentNode;
        parent.classList.toggle("expand");
        parent.removeChild(button)
        /*
        if (parent.classList.contains("expand")) {
          parent.innerText = fullDescs[index];
          button.innerText = "› ‹";
          button.title = "Sbalit"
        } else {
          parent.innerText = shorten(fullDescs[index], 150);
          button.innerText = "‹ ›";
          button.title = "Rozbalit"
        }
        */
        e.preventDefault();
        return false;
      }
    }, i, button);
    /*
    fullDescs.push(descs[i].innerText);
    
    descs[i].innerText = short;
    */
    var short = shorten(descs[i].innerText, 150);
    if (short.length == descs[i].innerText.length) {
      continue;
    }
    button.className = "expand-button";
    button.innerHTML = "<span class='fas fa-fw fa-chevron-down'/>";
    descs[i].appendChild(button);
    button.addEventListener("touchend", handler, false);
    button.addEventListener("click", handler, false);
    // descs[i].title = "Rozbalit dvojklikem"
  }
})()

