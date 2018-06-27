(function(){
  var descs = document.querySelectorAll('.clanek .desc');
  for (var i = 0; i < descs.length; i++) {
    descs[i].addEventListener("click", function (e) {
      e.target.classList.toggle("expand");
      return false;
      e.preventDefault();
    }, false);
  }
})()