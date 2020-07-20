require("IGCMS.Moreable", function () {
  IGCMS.Moreable.init({
    parent: ".clanky + .list-wrapper--multiple > div",
    moreText: "Další články",
    leftText: "zbývá %s"
  })
  IGCMS.Moreable.init({
    parent: ".dalsi + .list-wrapper--multiple > div",
    moreText: "Další příbuzné články",
    leftText: "zbývá %s"
  })
  IGCMS.Moreable.init({
    parent: ".meta > span",
    moreText: "...",
    leftText: "",
    displayStep: 3
  })
})