(function(){
  var descs = document.querySelectorAll('.clanek .desc');
  
  var fullDescs = [];
  
  var multiClickHandler = function (handlers, index, delay) {
    var clicks = 0, timeout, index = index, delay = delay || 250;
    return function (e) {
      clicks++;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        if(handlers[clicks]) handlers[clicks](e, index);
        clicks = 0;
      }, delay);
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
    if (len - indexof < 10) {
      return str;
    }
    return str.substr(0, indexof) + '...';
  }
  
  for (var i = 0; i < descs.length; i++) {
    var handler = multiClickHandler({
      1: function (e, index) {
        e.target.classList.toggle("expand");
        if (e.target.classList.contains("expand")) {
          e.target.innerText = fullDescs[index];
//           e.target.title = "Rozbalit dvojklikem"
        } else {
//           e.target.title = "Sbalit dvojklikem"
          e.target.innerText = shorten(fullDescs[index], 285);
        }
        e.preventDefault();
        return false;
      }
    }, i);
    fullDescs.push(descs[i].innerText);
    var short = shorten(descs[i].innerText, 285);
    if (short == descs[i].innerText.length) {
      continue;
    }
    descs[i].innerText = short;
    var button = document.createElement("a");
    button.innerText = ">";
    descs[i].appendChild(button);
    button.addEventListener("touchend", handler, false);
    button.addEventListener("click", handler, false);
    // descs[i].title = "Rozbalit dvojklikem"
  }
})()