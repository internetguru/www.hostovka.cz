(function(win) {

  require("IGCMS", function () {

    var Config = {}
    Config.ns = "eventable"
    Config.classNoEvent = Config.ns + "-noevent"
    Config.dataCategory = "data-" + Config.ns + "-category"
    Config.dataAction = "data-" + Config.ns + "-action"
    Config.dataLabel = "data-" + Config.ns + "-label"
    Config.dataValue = "data-" + Config.ns + "-value"
    Config.debug = false

    var submitted = false

    var Eventable = function () {

      // private
      var
        ga4 = false,
        fireEvents = function (elements) {
          if (elements.length === 0) {
            return
          }
          for (var i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains(Config.classNoEvent)) {
              continue;
            }
            var handler = clickHandler
            var eventName = "click"
            if (elements[i].nodeName.toLowerCase() === "form") {
              handler = submitHandler
              eventName = "submit"
            }
            elements[i].addEventListener(eventName, handler, false)
          }
        },
        firePrintEvent = function () {
          window.addEventListener("beforeprint", (event) => {
            sendGAEvent(Config.ns, "print", window.location.href)
          })
        },
        clickHandler = function (event) {
          var element = this
          var category = element.getAttribute(Config.dataCategory) || Config.ns
          var action = element.getAttribute(Config.dataAction) || "click"
          var label = element.getAttribute(Config.dataLabel) || element.href
          var value = element.getAttribute(Config.dataValue) || null
          sendGAEvent(category, action, label, value)
        },
        submitHandler = function (event) {
          // prevent double submitting (from dispatchEvent)
          if (submitted) {
            return
          }
          var element = this

          event.preventDefault()
          setTimeout(submitForm, 1000)

          function submitForm () {
            // prevent double submitting (from event_callback)
            if (submitted) {
              return
            }
            submitted = true
            submitEvent = new CustomEvent('submit', {
              cancelable: true,
              detail: "eventable",
            })
            var dispatched = element.dispatchEvent(submitEvent)
            if (dispatched) {
              element.submit()
            }
          }
          var category = element.getAttribute(Config.dataCategory) || Config.ns
          var action = element.getAttribute(Config.dataAction) || "submit"
          var label = element.getAttribute(Config.dataLabel) || element.action
          var value = element.getAttribute(Config.dataValue) || null
          sendGAEvent(category, action, label, value, submitForm)
        },
        sendGAEvent = function (category, action, label, value, callback) {
          if (Config.debug || typeof ga === "undefined") {
            console.log(arguments)
          } else if (ga4) {
            var params = {}
            if (category !== undefined) {
              params.event_category = category
            }
            if (label !== undefined) {
              params.event_label = label
            }
            if (value !== undefined) {
              params.value = value
            }
            if (callback !== undefined) {
              params.event_callback = callback
            }
            gtag('event', action, params);
          } else {
            ga('send', {
              'hitType': 'event',
              'eventCategory': category,
              'eventAction': action,
              'eventLabel': label,
            });
          }
        };

      // public
      return {
        debug: Config.debug,
        init: function (cfg) {
          IGCMS.initCfg(Config, cfg)
          ga4 = typeof gtag === "function"
          var allLinks = document.getElementsByTagName("a")
          var externalLinks = []
          var localLinks = []
          for (var i = 0; i < allLinks.length; i++) {
            var href = allLinks[i].getAttribute("href")
            if (href && href.startsWith("#")) {
              localLinks.push(allLinks[i])
              continue
            }
            if (allLinks[i].host && allLinks[i].host !== window.location.host) {
              externalLinks.push(allLinks[i])
              continue
            }
            if (allLinks[i].protocol == "mailto:" || allLinks[i].protocol == "tel:") {
              externalLinks.push(allLinks[i])
            }
          }
          fireEvents(localLinks)
          if (!ga4) {
            fireEvents(externalLinks)
          }
          fireEvents(document.getElementsByTagName("form"))
          fireEvents(document.getElementsByClassName(Config.ns))
          firePrintEvent()
        },
        register: function (link) {
          fireEvents([link])
        },
        sendGAEvent: sendGAEvent
      }
    };

    IGCMS.Eventable = Eventable();
  })
})(window)
