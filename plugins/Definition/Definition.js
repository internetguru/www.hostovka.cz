(() => {

  require("IGCMS", () => {

    var Config = {}
    Config.ns = "definition"
    Config.containerClass = Config.ns + "__cont"
    Config.hiddenClass = Config.ns + "__hidden"
    Config.closeClass = Config.ns + "__close"
    Config.closeValue = "×"
    Config.descClass = Config.ns + "--desc"
    Config.dataDescAttr = "data-" + Config.ns + "-desc"
    Config.hrefClass = Config.ns + "--href"
    Config.dataHrefTitleAttr = "data-" + Config.ns + "-href-title"
    Config.titlePrefix = "Článek: " // e.g. "Article: "
    Config.copyFromParent = ".part.odkazy .list > div" // e.g. .part.odkazy .list > div
    Config.css = '/* deginition.js */' +
      '.' + Config.hiddenClass + ' {' +
      '  display: none;' +
      '}' +
      '@media screen { a.' + Config.ns + '{' +
      '  border-bottom: medium dotted #d0abaf !important;' +
      '  color: inherit !important;' +
      '  cursor: pointer;' +
      '} }' +
      '.' + Config.containerClass + ' {' +
      '  font-style: normal;' +
      '  font-weight: normal;' +
      '  color: black;' +
      '  text-align: left;' +
      '  padding: 0;' +
      '  width: 100%;' +
      '  font-size: 1rem;' +
      '  margin: 0.5em auto;' +
      '  float:left;' +
      '}' +
      '.' + Config.descClass + ' {' +
      '  background: #fffacc;' +
      '  padding: 1.5em 1em 1em;' +
      '  position: relative;' +
      '  margin: 0;' +
      '  max-width: 35em;' +
      '}' +
      '.' + Config.hrefClass + ':before {' +
      '  content: "";' +
      '  display: table;' +
      '  padding-top: 0.25em;' +
      '}' +
      '.' + Config.closeClass + ' {' +
      '  position: absolute;' +
      '  top: 0.5em;' +
      '  right: 0.25em;' +
      '  border: 0 none;' +
      '  background: none;' +
      '  font-size: 1.5em;' +
      '  text-align: center;' +
      '  text-indent: 0.1em;' +
      '  line-height: 0;' +
      '  color: gray;' +
      '  cursor: pointer;' +
      '}'

    var DefinitionComponent = function (term) {
      var
        term = term,
        container = null,
        created = false
      return {
        term: term,
        created: created,
        container: container,
        createContainer: function () {
          var descValue = this.term.getAttribute(Config.dataDescAttr)
          if (!descValue) {
            descValue = this.term.getAttribute("title")
          }
          var desc = document.createElement("p")
          desc.className = Config.descClass
          desc.innerHTML = descValue;
          this.container.appendChild(desc);

          var closeButton = document.createElement("a")
          closeButton.addEventListener("click", this.toggle.bind(this), false)
          closeButton.innerHTML = Config.closeValue
          closeButton.className = Config.closeClass
          desc.appendChild(closeButton)

          var href = this.term.getAttribute("href")
          var hrefTitle = this.term.getAttribute(Config.dataHrefTitleAttr)
          if (!hrefTitle) {
            hrefTitle = href
          }
          if (hrefTitle && href) {
            var link = document.createElement("a")
            link.className = Config.hrefClass
            link.innerHTML = hrefTitle
            link.setAttribute("href", href)
            desc.appendChild(link)
          }
        },
        copyContainer: function () {
          var id = (new URL(`https://a.b.cz${term.getAttribute("href")}`)).pathname.substr(1)
          var copyElm = document.querySelector(`${Config.copyFromParent} .${id}`)
          if (!copyElm) {
            return false
          }
          this.container.appendChild(copyElm.cloneNode(true))
          return true
        },
        create: function () {
          this.container = document.createElement("div")
          this.container.className = Config.containerClass
          var inited = false
          if (Config.copyFromParent) {
            inited = this.copyContainer()
          }
          if (!inited) {
            this.createContainer()
          }
          this.term.parentNode.insertBefore(this.container, this.term.nextSibling)
          this.created = true
        },
        hide: function () {
          if (!this.container) {
            return
          }
          this.container.classList.add(Config.hiddenClass)
        },
        toggle: function () {
          this.container.classList.toggle(Config.hiddenClass)
        }
      }
    }

    var Definition = function () {

      var
        definitions = [],
        fireEvents = function () {
          const generateHandler = (value, method) => e => method(e, value)
          var terms = document.querySelectorAll(`.${Config.ns}`)
          for (var i = 0; i < terms.length; i++) {
            var termComp = new DefinitionComponent(terms[i])
            terms[i].classList.add("eventable")
            terms[i].title = `${Config.titlePrefix}${terms[i].title}`
            terms[i].addEventListener("click", generateHandler(termComp, toggleTerm), false)
            definitions.push(termComp)
          }
          return terms.length
        },
        toggleTerm = function (event, termComp) {
          if (event.ctrlKey || event.shiftKey) {
            return true;
          }
          definitions.forEach((item) => {
            if (item === termComp) {
              return
            }
            item.hide()
          })
          if (!termComp.created) {
            termComp.create()
          } else {
            termComp.toggle()
          }
          const delta = termComp.container.clientWidth / 4
          if (event.clientX - delta + termComp.container.clientWidth > window.innerWidth) {
            termComp.container.style.left = null
            termComp.container.style.right = `0px`
          } else {
            termComp.container.style.left = `${Math.max(event.clientX - delta, 0)}px`
          }
          event.preventDefault()
          return false;
        },
        fireControllEvents = function () {
          document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
              definitions.forEach((item) => item.hide())
            }
          })
          document.addEventListener("click", (event) => {
            definitions.forEach((item) => {
              if (!item.container) {
                return
              }
              if (event.target.closest(`.${Config.containerClass}`) || event.target.closest(`.${Config.ns}`)) {
                return
              }
              item.hide()
            })
          })
        }

      return {
        init: function (cfg) {
          IGCMS.initCfg(Config, cfg)
          var events = fireEvents()
          if (events === 0) {
            return
          }
          IGCMS.appendStyle(Config.css)
          fireControllEvents()
        },
      }
    }

    IGCMS.Definition = new Definition()
    require("IGCMS.Eventable", () => {
      IGCMS.Definition.init()
    })
  })
})()
