(function(win) {

  require("IGCMS", function () {

    var Config = {};
    Config.buttonHTML = "Copy";
    Config.selectTitle = "Copy";
    Config.ns = "copyable";

    var Copyable = function () {

      var
        getElements = function () {
          if (document.querySelectorAll) return document.querySelectorAll("." + Config.ns);
          var copyables = [];
          var allElements = document.getElementsByTagName("*");
          for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].classList.contains(Config.ns)) {
              copyables.push(allElements[i]);
            }
          }
          return copyables;
        },
        createButton = function (elements) {
          var i;
          for (i = 0; i < elements.length; i++) {
            var button = document.createElement("button");
            button.onclick = (function () {
              var currentI = i;
              var curE = elements;
              return function () {
                select(curE[currentI]);
                document.execCommand("copy");
              }
            })();
            button.innerHTML = Config.buttonHTML;
            button.title = Config.selectTitle;
            button.className = "eventable";
            var spanWrapper = document.createElement("span");
            var span = document.createElement("span");
            spanWrapper.appendChild(span);
            spanWrapper.className = Config.ns + "-wrapper";
            var copyable = elements[i];
            var parent = elements[i].parentNode;
            copyable.setAttribute("contenteditable", true);
            copyable.setAttribute("spellcheck", false);
            copyable.onfocus = function (event) {
              select(event.target)
            };
            if (parent.nodeName.toLowerCase() === "pre") {
              copyable = parent;
              parent = parent.parentNode;
            }
            parent.insertBefore(spanWrapper, copyable);
            span.appendChild(button);
            spanWrapper.appendChild(copyable);
          }
        },
        select = function (text) {
          var doc = document, range, selection;
          if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
          } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        };

      // public
      return {
        init: function (cfg) {
          // create toc
          IGCMS.initCfg(Config, cfg);
          var elements = getElements();
          createButton(elements);
        }
      }
    };

    IGCMS.Copyable = new Copyable();
  })
})(window)
