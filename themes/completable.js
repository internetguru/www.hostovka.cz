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
          appendValue: false,
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
        accented = {
          'A': '[Aa\xaa\xc0-\xc5\xe0-\xe5\u0100-\u0105\u01cd\u01ce\u0200-\u0203\u0226\u0227\u1d2c\u1d43\u1e00\u1e01\u1e9a\u1ea0-\u1ea3\u2090\u2100\u2101\u213b\u249c\u24b6\u24d0\u3371-\u3374\u3380-\u3384\u3388\u3389\u33a9-\u33af\u33c2\u33ca\u33df\u33ff\uff21\uff41]',
          'B': '[Bb\u1d2e\u1d47\u1e02-\u1e07\u212c\u249d\u24b7\u24d1\u3374\u3385-\u3387\u33c3\u33c8\u33d4\u33dd\uff22\uff42]',
          'C': '[Cc\xc7\xe7\u0106-\u010d\u1d9c\u2100\u2102\u2103\u2105\u2106\u212d\u216d\u217d\u249e\u24b8\u24d2\u3376\u3388\u3389\u339d\u33a0\u33a4\u33c4-\u33c7\uff23\uff43]',
          'D': '[Dd\u010e\u010f\u01c4-\u01c6\u01f1-\u01f3\u1d30\u1d48\u1e0a-\u1e13\u2145\u2146\u216e\u217e\u249f\u24b9\u24d3\u32cf\u3372\u3377-\u3379\u3397\u33ad-\u33af\u33c5\u33c8\uff24\uff44]',
          'E': '[Ee\xc8-\xcb\xe8-\xeb\u0112-\u011b\u0204-\u0207\u0228\u0229\u1d31\u1d49\u1e18-\u1e1b\u1eb8-\u1ebd\u2091\u2121\u212f\u2130\u2147\u24a0\u24ba\u24d4\u3250\u32cd\u32ce\uff25\uff45]',
          'F': '[Ff\u1da0\u1e1e\u1e1f\u2109\u2131\u213b\u24a1\u24bb\u24d5\u338a-\u338c\u3399\ufb00-\ufb04\uff26\uff46]',
          'G': '[Gg\u011c-\u0123\u01e6\u01e7\u01f4\u01f5\u1d33\u1d4d\u1e20\u1e21\u210a\u24a2\u24bc\u24d6\u32cc\u32cd\u3387\u338d-\u338f\u3393\u33ac\u33c6\u33c9\u33d2\u33ff\uff27\uff47]',
          'H': '[Hh\u0124\u0125\u021e\u021f\u02b0\u1d34\u1e22-\u1e2b\u1e96\u210b-\u210e\u24a3\u24bd\u24d7\u32cc\u3371\u3390-\u3394\u33ca\u33cb\u33d7\uff28\uff48]',
          'I': '[Ii\xcc-\xcf\xec-\xef\u0128-\u0130\u0132\u0133\u01cf\u01d0\u0208-\u020b\u1d35\u1d62\u1e2c\u1e2d\u1ec8-\u1ecb\u2071\u2110\u2111\u2139\u2148\u2160-\u2163\u2165-\u2168\u216a\u216b\u2170-\u2173\u2175-\u2178\u217a\u217b\u24a4\u24be\u24d8\u337a\u33cc\u33d5\ufb01\ufb03\uff29\uff49]',
          'J': '[Jj\u0132-\u0135\u01c7-\u01cc\u01f0\u02b2\u1d36\u2149\u24a5\u24bf\u24d9\u2c7c\uff2a\uff4a]',
          'K': '[Kk\u0136\u0137\u01e8\u01e9\u1d37\u1d4f\u1e30-\u1e35\u212a\u24a6\u24c0\u24da\u3384\u3385\u3389\u338f\u3391\u3398\u339e\u33a2\u33a6\u33aa\u33b8\u33be\u33c0\u33c6\u33cd-\u33cf\uff2b\uff4b]',
          'L': '[Ll\u0139-\u0140\u01c7-\u01c9\u02e1\u1d38\u1e36\u1e37\u1e3a-\u1e3d\u2112\u2113\u2121\u216c\u217c\u24a7\u24c1\u24db\u32cf\u3388\u3389\u33d0-\u33d3\u33d5\u33d6\u33ff\ufb02\ufb04\uff2c\uff4c]',
          'M': '[Mm\u1d39\u1d50\u1e3e-\u1e43\u2120\u2122\u2133\u216f\u217f\u24a8\u24c2\u24dc\u3377-\u3379\u3383\u3386\u338e\u3392\u3396\u3399-\u33a8\u33ab\u33b3\u33b7\u33b9\u33bd\u33bf\u33c1\u33c2\u33ce\u33d0\u33d4-\u33d6\u33d8\u33d9\u33de\u33df\uff2d\uff4d]',
          'N': '[Nn\xd1\xf1\u0143-\u0149\u01ca-\u01cc\u01f8\u01f9\u1d3a\u1e44-\u1e4b\u207f\u2115\u2116\u24a9\u24c3\u24dd\u3381\u338b\u339a\u33b1\u33b5\u33bb\u33cc\u33d1\uff2e\uff4e]',
          'O': '[Oo\xba\xd2-\xd6\xf2-\xf6\u014c-\u0151\u01a0\u01a1\u01d1\u01d2\u01ea\u01eb\u020c-\u020f\u022e\u022f\u1d3c\u1d52\u1ecc-\u1ecf\u2092\u2105\u2116\u2134\u24aa\u24c4\u24de\u3375\u33c7\u33d2\u33d6\uff2f\uff4f]',
          'P': '[Pp\u1d3e\u1d56\u1e54-\u1e57\u2119\u24ab\u24c5\u24df\u3250\u3371\u3376\u3380\u338a\u33a9-\u33ac\u33b0\u33b4\u33ba\u33cb\u33d7-\u33da\uff30\uff50]',
          'Q': '[Qq\u211a\u24ac\u24c6\u24e0\u33c3\uff31\uff51]',
          'R': '[Rr\u0154-\u0159\u0210-\u0213\u02b3\u1d3f\u1d63\u1e58-\u1e5b\u1e5e\u1e5f\u20a8\u211b-\u211d\u24ad\u24c7\u24e1\u32cd\u3374\u33ad-\u33af\u33da\u33db\uff32\uff52]',
          'S': '[Ss\u015a-\u0161\u017f\u0218\u0219\u02e2\u1e60-\u1e63\u20a8\u2101\u2120\u24ae\u24c8\u24e2\u33a7\u33a8\u33ae-\u33b3\u33db\u33dc\ufb06\uff33\uff53]',
          'T': '[Tt\u0162-\u0165\u021a\u021b\u1d40\u1d57\u1e6a-\u1e71\u1e97\u2121\u2122\u24af\u24c9\u24e3\u3250\u32cf\u3394\u33cf\ufb05\ufb06\uff34\uff54]',
          'U': '[Uu\xd9-\xdc\xf9-\xfc\u0168-\u0173\u01af\u01b0\u01d3\u01d4\u0214-\u0217\u1d41\u1d58\u1d64\u1e72-\u1e77\u1ee4-\u1ee7\u2106\u24b0\u24ca\u24e4\u3373\u337a\uff35\uff55]',
          'V': '[Vv\u1d5b\u1d65\u1e7c-\u1e7f\u2163-\u2167\u2173-\u2177\u24b1\u24cb\u24e5\u2c7d\u32ce\u3375\u33b4-\u33b9\u33dc\u33de\uff36\uff56]',
          'W': '[Ww\u0174\u0175\u02b7\u1d42\u1e80-\u1e89\u1e98\u24b2\u24cc\u24e6\u33ba-\u33bf\u33dd\uff37\uff57]',
          'X': '[Xx\u02e3\u1e8a-\u1e8d\u2093\u213b\u2168-\u216b\u2178-\u217b\u24b3\u24cd\u24e7\u33d3\uff38\uff58]',
          'Y': '[Yy\xdd\xfd\xff\u0176-\u0178\u0232\u0233\u02b8\u1e8e\u1e8f\u1e99\u1ef2-\u1ef9\u24b4\u24ce\u24e8\u33c9\uff39\uff59]',
          'Z': '[Zz\u0179-\u017e\u01f1-\u01f3\u1dbb\u1e90-\u1e95\u2124\u2128\u24b5\u24cf\u24e9\u3390-\u3394\uff3a\uff5a]'
        },
        /**
        * Creates a RegExp that matches the words in the search string.
        * Case and accent insensitive.
        */
        makePattern = function (search_string) {
          // escape meta characters
          search_string = search_string.replace(/([|()[{.+*?^$\\])/g,"\\$1")
          // split into words
          var words = search_string.split(/\s+/)
          // sort by length
          var length_comp = function (a, b) {
            return b.length - a.length
          }
          words.sort(length_comp)
          // replace characters by their compositors
          var accent_replacer = function(chr) {
            return accented[chr.toUpperCase()] || chr
          }
          for (var i = 0; i < words.length; i++) {
            words[i] = words[i].replace(/\S/g, accent_replacer)
          }
          // join as alternatives
          var regexp = words.join("|")
          return regexp
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
            changeLink.innerHTML = `<span class="far fa-fw fa-search"></span>${Config.defaultChangeText}`
            changeLink.className = "button button--simple button--img button--img-inline eventable"
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
            navig.value = currentFile.value
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
              if (open) {
                navig.value = ""
                closeNavig()
                break
              }
              if (navig.value) {
                navig.value = ""
                break
              }
              navig.blur()
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
          // var qvalue = IGCMS.preg_quote(value).replace(/\\\*/g, "[^/ ]*")
          var qvalue = makePattern(value)
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
            var secondaryVal = Config.appendValue ? (options[j].hasAttribute("value") ? options[j].value : "") : ""
            var val = options[j].innerText
            if (secondaryVal) {
              decorateSecondary = true
              val += " " + secondaryVal
            }
            var classes = options[j].className
            Config.files.push({
              path: options[j].textContent,
              value: options[j].value,
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
              value: "invalid path",
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
