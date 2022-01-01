(function() {
  require("IGCMS", function() { require("IGCMS.Eventable", function() {
    
    var Feedback = function () {
      
      var
      wrapper = null,
      origContent = null,
      feedbackElm = null,
      heading = null,
      hOriginText = null,
      step1content = null,
      step2inited = false,
      questionLabel = null,
      emailInputDescDd = null,
      beneficial = null,
      emailValue = null,
      questionValue = null,
      action = null,
      Config = {
        elmSelector: null,
        hSelector: null,
        hText: null
      },
      getElm = function (type, text, className) {
        var elm = document.createElement(type)
        if (text) {
          elm.innerHTML = text
        }
        if (className) {
          elm.className = className
        }
        return elm
      },
      validateInput = function (inputElm, optional, pattern) {
        if (typeof optional == "undefined") {
          optional = false
        }
        if (optional && inputElm.value == "") {
          return true
        }
        if (!pattern && inputElm.checkValidity()) {
          return true
        }
        if (pattern) {
          var regexp = new RegExp("^" + pattern + "$")
          if (regexp.test(inputElm.value)) {
            return true
          }
        }
        inputElm.reportValidity()
        inputElm.classList.add("feedback-invalid-input")
        inputElm.focus()
        return false
      }
      processYes = function (event) {
        var question = "Co byste vzkázali ostatním čtenářům?"
        var emailDesc = "Nejmileší komentáře zveřejníme."
        initStep2("yes", question, emailDesc)
      },
      processNo = function (event) {
        var question = " Co byste na článku změnili?"
        initStep2("no", question, "")        
      },
      showHide = function (prevClass, curClass) {
        wrapper.childNodes.forEach(function (child) {
          if (child.classList.contains(prevClass)) {
            child.style.display = ""
          } else if (child.classList.contains(curClass)) {
            child.style.display = "none"
          }
        })
      },
      initStep2 = function (beneficialText, question, emailDesc) {
        beneficial = beneficialText == "yes" ? 1 : 0
        /*
        IGCMS.Eventable.sendGAEvent(
          "feedback",
          "beneficial",
          beneficialText,
          beneficial
        )
        */
        if (!step2inited) {
          wrapper.childNodes.forEach(function (child) {
            child.style.display = "none"
            child.classList.add("step1")
          })
  
          var questionDt = getElm("dt")
          questionLabel = getElm("label", question)
          var questionInputDd = getElm("dd")
          var questionInput = getElm("textarea")
  
          questionLabel.setAttribute("for", "feedback-text")
          questionInput.oninput = function () {
            questionInput.setCustomValidity("")
            questionInput.reportValidity()
          }
          questionDt.appendChild(questionLabel)
          questionInput.id = "feedback-text"
          questionInputDd.appendChild(questionInput)
          wrapper.appendChild(questionDt)
          wrapper.appendChild(questionInputDd)
  
          var emailDt = getElm("dt")
          var emailLabel = getElm("label", "Váš e-mail (nepovinné)")
          var emailInputDd = getElm("dd")
          var emailInput = getElm("input")
  
          emailLabel.setAttribute("for", "feedback-email")
          emailDt.appendChild(emailLabel)
          emailInput.type = "email"
          emailInput.name = "email"
          emailInput.id = "feedback-email"
          emailInputDd.appendChild(emailInput)
          wrapper.appendChild(emailDt)
          wrapper.appendChild(emailInputDd)
          emailInputDescDd = getElm("dd", emailDesc)
          wrapper.appendChild(emailInputDescDd)
  
          var donationText = "Pomohla by veřejná diskuze, osobní konzultace či jiné rozšíření Praléku?"
          var nextStepDt = getElm("dt", "Další krok")
          var nextStepDd = getElm("dd")
          var nextStepNext = getElm("button", "Odeslat", "feedback-yes button button--border")
          var nextStepPrev = getElm("button", "Zpět", "button button--simple")
          var nextStepSkip = getElm("button", "Přeskočit", "button button--simple")
  
          nextStepDt.className = "hide"
          nextStepDd.appendChild(nextStepNext)
          nextStepDd.appendChild(nextStepPrev)
          nextStepDd.appendChild(nextStepSkip)
          emailInput.addEventListener("change", function () {
            emailValue = this.value
          }, false)
          questionInput.addEventListener("change", function () {
            questionValue = this.value
          }, false)
          nextStepNext.addEventListener("click", function () {
            if (!validateInput(questionInput, false, ".*\\w.{8,}\\w.*")) {
              questionInput.setCustomValidity("Položka je povinná")
              questionInput.reportValidity()
              return
            }
            if (!validateInput(emailInput, true)) {
              return
            }
            action = this.innerHTML
            initStep3()
          }, false)
          nextStepPrev.addEventListener("click", function () {
            action = this.innerHTML
            showHide("step1", "step2")
          })
          nextStepSkip.addEventListener("click", function () {
            if (emailInput.value || questionInput.value) {
              if (!confirm("Formulář má vyplněná pole, jste si jistí, že chcete přeskočit odeslání odpovědi?")) {
                return
              }
            }
            action = this.innerHTML
            initStep3()
          }, false)
          wrapper.appendChild(nextStepDt)
          wrapper.appendChild(nextStepDd)
          wrapper.childNodes.forEach(function (child) {
            if (!child.classList.contains("step1")) {
              child.classList.add("step2")
            }
          })
          var thanks = getElm('p', 'Děkujeme za Vaši zpětnou vazbu', 'step3')
          wrapper.appendChild(thanks)
          step2inited = true
          return
        }
        showHide("step2", "step1")
        questionLabel.innerHTML = question
        emailInputDescDd.innerHTML = emailDesc
      },
      initStep3 = function () {
        showHide("step3", "step2")
      },
      sendEvent = function () {
        if (beneficial === null) {
          return
        }
        feedback = "Message: " + questionValue
        feedback += "\nEmail: " + emailValue
        feedback += "\nAction: " + action
        var category = questionValue ? "hasmessage" : "nomessage"
        IGCMS.Eventable.sendGAEvent("feedback", category, feedback, beneficial)
      },
      init = function () {
        feedbackElm = document.querySelector(Config.elmSelector)
        
        var part = getElm('div', '', 'part feedback')
        wrapper = getElm("dl")
        part.appendChild(wrapper)
        var dt = getElm("dt", "Líbil se Vám tento článek?", "card__heading")
        var dd = getElm("dd")
        wrapper.appendChild(dt)
        wrapper.appendChild(dd)

        var yesButton = getElm("button", "<span class='fas fa-fw fa-check'></span>ano", "feedback-yes button button--border button--img button--img-inline")
        var noButton = getElm("button", "<span class='fas fa-fw fa-times'></span>ne", "feedback-no button button--border button--img button--img-inline")
        dd.appendChild(yesButton)
        dd.appendChild(noButton)
        yesButton.addEventListener("click", processYes, false)
        noButton.addEventListener("click", processNo, false)

        feedbackElm.parentNode.insertBefore(part, feedbackElm)

        window.addEventListener("beforeunload", sendEvent, false)
      }

      return {
        init: function (cfg) {
          IGCMS.initCfg(Config, cfg)
          init()
        }
      }
    }

    var feedback = new Feedback()
    feedback.init({
      elmSelector: ".part.dalsi",
      hText: "Zpětná vazba"
    })

  }) })
})()
