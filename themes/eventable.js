(function(win) {

  require("IGCMS", function () {

    var Config = {}
    Config.ns = "eventable"
    Config.classNoEvent = Config.ns + "-noevent"
    Config.dataCategory = "data-" + Config.ns + "-category"
    Config.dataAction = "data-" + Config.ns + "-action"
    Config.dataLabel = "data-" + Config.ns + "-label"
    Config.debug = false

    var Eventable = function () {

      // private
      var
        fireEvents = function (elements) {
          if (elements.length === 0) {
            return
          }
          for (var i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains(Config.classNoEvent)) {
              continue;
            }
            var handler = sendGAEvents
            var eventName = "click"
            if (elements[i].nodeName.toLowerCase() === "form") {
              handler = sendGAFormEvents
              eventName = "submit"
            }
            elements[i].addEventListener(eventName, handler, false)
          }
        },
        sendGAEvents = function (event) {
          var element = event.target
          // all external
          if (element.host === window.location.host) {
            if (!element.classList.contains(Config.ns)) {
              element = element.parentNode
            }
            if (!element.classList.contains(Config.ns)) {
              return
            }
          }
          var category = element.getAttribute(Config.dataCategory) || element.id || element.className || element.nodeName
          var action = element.getAttribute(Config.dataAction) || element.href || element.nodeName
          var label = element.getAttribute(Config.dataLabel) || element.innerText
          sendGAEvent(category, action, label)
        },
        sendGAFormEvents = function (event) {
          var form = event.target
          var inputs = form.getElementsByTagName("input")
          var category = form.getAttribute(Config.dataCategory) || form.id || form.className || 'form-' + form.action + '-' + form.method
          var action = form.action + '-' + form.method
          var label = form.getAttribute(Config.dataLabel) || ""
          var value = ""
          for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "hidden") {
              continue
            }
            if (value != "") {
              value += "\n"
            }
            value = value + (inputs[i].name || inputs[i].nodeName) + ":" + inputs[i].value
          }
          sendGAEvent(category, action, label, value)
        },
        sendGAEvent = function (category, action, label, value) {
          if (typeof value == "undefined") {
            value = 1
          }
          if (Config.debug) {
            alert("category: '" + category + "',"
              + "action: '" + action + "',"
              + "label: '" + label + "',"
              + "value: '" + value + "'")
          } else {
            ga('send', {
              'hitType': 'event',
              'eventCategory': category,
              'eventAction': action,
              'eventLabel': label,
              'eventValue': value
            });
          }
        };

      // public
      return {
        debug: Config.debug,
        init: function (cfg) {
          IGCMS.initCfg(Config, cfg)
          var allLinks = document.getElementsByTagName("a")
          var externalLinks = []
          for (var i = 0; i < allLinks.length; i++) {
            if (allLinks[i].host && allLinks[i].host !== window.location.host) {
              externalLinks.push(allLinks[i])
            }
          }
          fireEvents(externalLinks)
          fireEvents(document.getElementsByTagName("form"))
          fireEvents(document.getElementsByClassName(Config.ns))
        },
        sendGAEvent: sendGAEvent
      }
    };

    IGCMS.Eventable = Eventable();
  })
})(window)