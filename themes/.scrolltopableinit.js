require("IGCMS", () => {
  IGCMS.ready(() => {
    require("IGCMS.Scrolltopable", () => {
      IGCMS.Scrolltopable.init({
        text: "<span class='fas fa-fw fa-chevron-up'></span>"
      })
    })
  })
})