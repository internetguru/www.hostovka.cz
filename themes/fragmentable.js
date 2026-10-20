(function(a){require("IGCMS",function(){var b={ns:"fragmentable"};a.IGCMS.Fragmentable=new function Fragmentable(){var/**
         * Remove only fragments created by fragmentable
         */c=!1,/**
         * Triger changeFragment on document click
         */d=function(){document.addEventListener("click",e,!1)},/**
         * Change fragment according to heading id.
         * H1 and non-heading elements will remove fragment.
         * @param  {Event} event
         */e=function(b){var d=b.target.closest("h2, h3, h4, h5, h6");return null===b.target?void 0:d&&["h2","h3","h4","h5","h6"].includes(d.nodeName.toLowerCase())?d.id?(c=!0,a.history.replaceState("","","#".concat(d.id)),void a.dispatchEvent(new HashChangeEvent("hashchange"))):void 0:void(!1===c||b.target.closest("form, a")||(a.history.replaceState("","",a.location.href.split("#")[0]),a.dispatchEvent(new HashChangeEvent("hashchange")),c=!1))};return{/**
         * @param  {Object} cfg custom configuration
         */init:function init(a){IGCMS.initCfg(b,a),d()}}}})})(window);
