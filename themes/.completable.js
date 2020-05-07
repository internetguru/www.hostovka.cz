(function(win) {

  require("IGCMS", function () {

    var GlobalConfig = {}
    GlobalConfig.ns = "js-completable"
    GlobalConfig.inputClass = GlobalConfig.ns + "__input"
    GlobalConfig.labelClass = GlobalConfig.ns + "__wrapper"
    GlobalConfig.naviglistClass = GlobalConfig.ns + "__navig"
    GlobalConfig.itemClass = GlobalConfig.ns + "__item"
    GlobalConfig.activeItemClass = GlobalConfig.ns + "__item--active"
    GlobalConfig.defaultLabel = "Select file "

    var Completable = function () {

      var
        Config = {
          selectSelector: "",
          label: GlobalConfig.defaultLabel,
          placeholder: "",
          defaultChangeText: "",
          filterSelector: "",
          sendFormClass: "",
          sendFormText: "",
          keyboardShortcut: "",
          onSend: "",
          onFilterButtonClick: "",
          submitOnEnter: true,
          submitOnClick: false,
          sendOnEmpty: false,
          expandOnFocus: false,
          appendValue: true,
          itemsLimit: 15,
          decorateListItem: function (itemValue) { return itemValue },
          undecorateListItem: function (itemValue) {
            // remove tags by default
            return itemValue.replace(/<\/?[^>]+(>|$)/g, "")
          },
        },
        navig = null,
        open = false,
        active = -1,
        textNavigValue = "",
        label = null,
        list = null,
        key = null,
        focused = false,
        clickCount = 0,
        singleClickTimer = null,

        getWinHeight = function () {
          var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0]
          return w.innerHeight || e.clientHeight || g.clientHeight
        },
        getScrolltop = function () {
          var doc = document.documentElement
          return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
        },
        getOffsetTop = function (elm) {
          var bodyRect = document.body.getBoundingClientRect(),
            elemRect = elm.getBoundingClientRect()
          return elemRect.top - bodyRect.top
        },
        initStructure = function () {
          list = document.createElement("ul")
          list.classList.add(GlobalConfig.naviglistClass)
          var textNavig = document.createElement("input")
          textNavig.autocomplete = "off"
          if (navig.tabIndex) {
            textNavig.tabIndex = navig.tabIndex
          }
          textNavig.name = navig.name
          textNavig.placeholder = Config.placeholder
          textNavig.type = "text"
          textNavig.className = GlobalConfig.inputClass
          textNavig.id = navig.id || ""
          label = document.createElement("label")
          label.innerHTML = Config.label
          label.className = GlobalConfig.labelClass
          label.appendChild(textNavig)
          navig.parentNode.replaceChild(label, navig)
          navig = textNavig
          navig.parentNode.appendChild(list)
          updateSize()
        },
        initEvents = function () {
          // update navigList size
          win.addEventListener("resize", updateSize, false)
          win.addEventListener("scroll", updateSize, false)
          // handle form submitting
          navig.form.addEventListener("submit", fillVal, true)
          // handle completable submitting
          navig.addEventListener("fillValEvent", fillVal, true)
          navig.addEventListener("click", handleDoubleClick, false)
          // handle completable input events
          navig.addEventListener("input", inputText, false)
          navig.addEventListener("blur", closeNavig, false)
          navig.addEventListener("keydown", processKey, false)
          navig.addEventListener("focus", processFocus, false)
          if (Config.keyboardShortcut) {
            initShortcutEvent()
          }
          if (Config.filterSelector) {
            initFilterButtonEvent()
          }
        },
        handleDoubleClick = function () {
          clickCount++;
          if (clickCount === 1) {
            singleClickTimer = setTimeout(function() {
              clickCount = 0;
            }, 400);
          } else if (clickCount === 2) {
            clearTimeout(singleClickTimer)
            clickCount = 0
            openNavig()
          }
        },
        processFocus = function () {
          if (focused) {
            return
          }
          if (Config.expandOnFocus) {
            openNavig()
          }
          focused = true
          createSelection(navig, 0, navig.value.length)
        },
        initShortcutEvent = function () {
          require("Mousetrap", function () {
            Mousetrap.bind(Config.keyboardShortcut, function (event) {
              navig.focus()
              createSelection(navig, 0, navig.value.length)
              try {
                require("IGCMS.Eventable", function () {
                  IGCMS.Eventable.sendGAEvent("shortcut", "completable", Config.keyboardShortcut)
                })
              } catch(exception) {}
              event.preventDefault()
              return false
            })
          })
        },
        initFilterButtonEvent = function () {
          var filters = document.querySelectorAll(Config.filterSelector)
          for (var i = 0; i < filters.length; i++) {
            var changeLink = document.createElement("label")
            changeLink.textContent = Config.defaultChangeText
            changeLink.className = "button eventable"
            changeLink.setAttribute("for", navig.id)
            changeLink.addEventListener("click", function (e) {
            try {
              require("IGCMS.Eventable", function () {
                IGCMS.Eventable.sendGAEvent("filter button", "completable", Config.defaultChangeText)
              })
            } catch(exception) {}
            }, false)
            filters[i].appendChild(changeLink)
          }
        },
        fillVal = function (event) {
          if (event.originCompletable && event.originCompletable !== navig.id) {
            return false
          }
          // For case of multiple completables in one form is focused last empty completable
          if (!Config.sendOnEmpty && navig.value == "") {
            navig.focus()
            event.preventDefault()
            return false
          }
          navig.value = Config.undecorateListItem(navig.value)
          files = Config.files
          currentFile = null
          for (var i = 0; i < files.length; i++) {
            if (files[i].defaultVal.toLowerCase() != navig.value.toLowerCase()) {
              continue
            }
            currentFile = files[i]
            navig.value = currentFile.path
          }
          if (Config.onSend) {
            Config.onSend(navig, currentFile, closeNavig)
          }
        },
        openNavig = function (updateFiles) {
          updateFiles = typeof updateFiles === 'undefined' ? true : updateFiles
          if (open) {
            return
          }
          updateSize()
          clearNavig()
          open = true
          list.classList.add(GlobalConfig.activeItemClass)
          if (updateFiles) {
            update(Config.files)
          }
        },
        clearNavig = function () {
          textNavigValue = ""
          list.innerHTML = ""
          active = -1
        },
        closeNavig = function () {
          clearNavig()
          focused = false
          open = false
          list.style.height = "0em"
          list.classList.remove(GlobalConfig.activeItemClass)
        },
        scrollParentToChild = function (parent, child) {
          // Where is the parent on page
          var parentRect = parent.getBoundingClientRect()
          // What can you see?
          var parentViewableArea = {
            height: parent.clientHeight,
            width: parent.clientWidth
          }
          // Where is the child
          var childRect = child.getBoundingClientRect()
          // Is the child viewable?
          var isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height)
          // if you can't see the child try to scroll parent
          if (!isViewable) {
            // scroll by offset relative to parent
            parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
          }
        },
        setActiveList = function () {
          list.childNodes[active].classList.add(GlobalConfig.activeItemClass)
          scrollParentToChild(list, list.childNodes[active])
          if (!list.childNodes[active].classList.contains(Config.sendFormClass)) {
            // navig.value = list.childNodes[active].dataset.val.replace(/<br>/g, " - ")
            navig.value = list.childNodes[active].dataset.val
          } else {
            navig.value = textNavigValue
          }
        },
        processKey = function (event) {
          switch (event.keyCode) {
            case 13: //enter
              if (list.childNodes[active]) {
                navig.value = list.childNodes[active].dataset.val
              }
              submitEvent = new Event('fillValEvent')
              navig.dispatchEvent(submitEvent)
              if (!Config.submitOnEnter) {
                event.preventDefault()
              }
              break
            case 27: //esc
              // remove focus if navig is not open
              if (!open) {
                navig.blur()
                break
              }
              navig.value = textNavigValue
              closeNavig()
              break
            case 38: //up
              if (!open) {
                openNavig()
              }
              if (typeof list.childNodes[active] !== "undefined") {
                list.childNodes[active].classList.remove(GlobalConfig.activeItemClass)
              }
              if (active == -1) {
                active = list.childNodes.length
              }
              if (--active <= -1) {
                navig.value = textNavigValue
                event.preventDefault()
                return
              }
              setActiveList()
              event.preventDefault()
              break
            case 40: //down
              if (!open) {
                openNavig()
              }
              if (typeof list.childNodes[active] !== "undefined") {
                list.childNodes[active].classList.remove(GlobalConfig.activeItemClass)
              }
              if (active == list.childNodes.length) {
                active = -1
              }
              if (++active >= list.childNodes.length) {
                navig.value = textNavigValue
                event.preventDefault()
                return
              }
              setActiveList()
              event.preventDefault()
              break
            default:
              key = event.keyCode
              return true
          }
        },
        inputText = function (event) {
          if (key == 46) {
            clearSelection()
            return
          }
          clearNavig()
          openNavig(false)
          var targetNavig = !event ? navig : event.target || event.srcElement
          var value = targetNavig.value
          textNavigValue = value
          var fs = filter(Config.files, value)
          update(fs)
        },
        clearSelection = function (navig) {
          if (!navig.selectionStart) {
            return
          }
          navig.value = navig.value.substring(0, navig.selectionStart)
        },
        createSelection = function (navig, start, end) {
          if (navig.createTextRange) {
            var selRange = navig.createTextRange()
            selRange.collapse(true)
            selRange.moveStart('character', start)
            selRange.moveEnd('character', end)
            selRange.select()
            navig.focus()
            return
          }
          if (navig.setSelectionRange) {
            navig.focus()
            navig.setSelectionRange(start, end)
            return
          }
          if (typeof navig.selectionStart != 'undefined') {
            navig.selectionStart = start
            navig.selectionEnd = end
            navig.focus()
          }
        },
        updateSize = function () {
          list.style.height = "0px"
          var labelRect = label.getBoundingClientRect()
          var navigRect = navig.getBoundingClientRect()
          list.style.left = (navigRect.left - labelRect.left) + "px"
          list.style.width = navig.offsetWidth + "px"
          if (navigRect.top < (getWinHeight() - navigRect.top)) {
            // down
            list.style.height = "auto"
            list.style.top = navigRect.height + "px"
            list.style.maxHeight = (getWinHeight() - getOffsetTop(list) + getScrolltop()) + "px"
          } else {
            // up
            list.style.maxHeight = navigRect.top + "px"
            list.style.height = "auto"
            var listRect = list.getBoundingClientRect()
            list.style.top = "-" + listRect.height + "px"
          }
        },
        fileMergeSort = function (arr) {
          if (arr.length < 2) {
            return arr
          }
          var middle = parseInt(arr.length / 2)
          return merge(fileMergeSort(arr.slice(0, middle)), fileMergeSort(arr.slice(middle, arr.length)))
        },
        merge = function (left, right) {
          var result = []
          while (left.length && right.length) {
            if (left[0].priority <= right[0].priority) {
              result.push(left.shift())
            } else {
              result.push(right.shift())
            }
          }
          while (left.length) {
            result.push(left.shift())
          }
          while (right.length) {
            result.push(right.shift())
          }
          return result
        },
        filter = function (arr, value) {
          var fs = []
          var qvalue = IGCMS.preg_quote(value).replace(/\\\*/g, "[^/ ]*")
          var pattern = new RegExp("(" + qvalue + ")(?=[^<>]*?(?:<\/?|$))", "gi")
          if (!value) {
            pattern = false
          }
          for (var i = 0; i < arr.length; i++) {
            // allways add sendForm item
            if (Config.sendFormText && arr[i].class == Config.sendFormClass) {
              fs.push(arr[i])
              continue
            }
            var r = doFilter(arr[i], value, pattern)
            if (typeof r != "undefined") {
              fs.push(r)
            }
          }
          // If there is only one result and it is same as input then show all
          if (fs.length == 1 && fs[0].defaultVal === value) {
            fs = arr
          }
          fs = fileMergeSort(fs)
          return fs
        },
        doFilter = function (f, value, pattern) {
          try {
            if (pattern && !f.defaultVal.match(pattern)) {
              return
            }
            var r = {}
            var priority = 3
            if (pattern) {
              if (f.path.replace(/^.*[\\\/]/, '').indexOf(value) === 0) {
                priority = 1
              }
              else {
                var parts = f.path.split(/[ _\/-]/)
                for (var i = 0; i < parts.length; i++) {
                  if (parts[i].indexOf(value) !== 0) continue;
                  priority = 2
                }
              }
              r.val = f.val.replace(pattern, "<strong>$1</strong>")
            } else {
              r.val = f.val
            }
            r.priority = priority
            r.defaultVal = f.defaultVal
            r.path = f.path
            r.class = f.class
            r.origElm = f.origElm
            return r
          } catch (e) {
          }
        },
        setCurrentFile = function () {
          var href = decodeURIComponent(window.location.href)
          for (var i = 0; i < Config.files.length; i++) {
            if (href.indexOf(Config.files[i].path) !== -1) {
              active = i
              navig.value = Config.files[i].defaultVal
              return
            }
          }
        },
        update = function (fs) {
          var first = true
          for (var i = 0; i < Math.min(fs.length, Config.itemsLimit); i++) {
            // selection
            if (first
              && navig.value.length
              && key !== 8
              && fs[i].defaultVal.toLowerCase().indexOf(navig.value.toLowerCase()) == 0
              && (fs[i].class == "" || fs[i].class != Config.sendFormClass)
            ) { // 8 is backspace
              var start = navig.value.length
              var end = fs[i].defaultVal.length
              if (start === end) {
                start = 0
              }
              navig.value = fs[i].defaultVal
              createSelection(navig, start, end)
              first = false
            }
            var li = document.createElement("li")
            li.innerHTML = fs[i].val
            li.className = GlobalConfig.itemClass + " " + fs[i].class
            li.dataset.path = fs[i].path
            li.dataset.val = fs[i].defaultVal
            li.onmousemove = (function () {
              var localValue = fs[i].defaultVal
              var localNavig = navig
              if (fs[i].class != "" && fs[i].class == Config.sendFormClass) {
                localValue = false
              }
              return function () {
                if (localValue !== false) {
                  localNavig.value = localValue
                } else {
                  clearSelection(localNavig)
                }
              }
            })()
            li.onmousedown = (function () {
              var localValue = fs[i].defaultVal
              var localNavig = navig
              var localList = list
              if (fs[i].class != "" && fs[i].class && fs[i].class == Config.sendFormClass) {
                localValue = false
              }
              return function (event) {
                if (localValue !== false) {
                  localNavig.value = localValue
                } else {
                  clearSelection(localNavig)
                }
                localList.onmouseout = null
                if (Config.onSend || Config.submitOnClick) {
                  submitEvent = new Event('fillValEvent')
                  localNavig.dispatchEvent(submitEvent)
                }
                if (Config.submitOnClick) {
                  localNavig.form.submit()
                }
                event.stopPropagation()
              }
            })()
            list.appendChild(li)
            list.onmouseout = (function () {
              var previousValue = textNavigValue
              var localNavig = navig
              return function () {
                localNavig.value = previousValue
              }
            })()
          }
          updateSize()
        }

      // public
      return {
        init: function (cfg) {
          Config.files = []
          IGCMS.initCfg(Config, cfg)
          navig = document.querySelector(cfg.selectSelector)
          if (!navig) {
            return
          }
          var options = navig.getElementsByTagName("option")
          var decorateSecondary = false
          for (var j = 0; j < options.length; j++) {
            var secondaryVal = Config.appendValue ? options[j].value : ""
            var val = options[j].innerText
            if (secondaryVal) {
              decorateSecondary = true
              val += " " + secondaryVal
            }
            var classes = options[j].className
            Config.files.push({
              path: (options[j].value ? options[j].value : options[j].textContent),
              priority: 0,
              val: Config.decorateListItem(val),
              defaultVal: val,
              class: classes,
              origElm: options[j]
            })
          }
          if (decorateSecondary) {
            Config.decorateListItem = function (itemValue) {
              return itemValue.replace(/([^ ]+)$/, "</br><span class='fp-secondary'>$1</span>")
            }
          }
          if (Config.sendFormText) {
            Config.files.push({
              path: "invalid path",
              priority: 10,
              val: Config.sendFormText,
              defaultVal: Config.sendFormText,
              class: Config.sendFormClass,
              origElm: null
            })
          }
          initStructure()
          window.setTimeout(function () {
            initEvents()
          }, 500)
          setCurrentFile()
        },
        clearSelection: clearSelection
      }
    }

    var CompletableIniter = function () {
      return {
        init: function (cfg) {
          var instance = new Completable
          instance.init(cfg)
        }
      }
    }

    var cssApended = false
    IGCMS.Completable = new CompletableIniter
  })
})(window)
