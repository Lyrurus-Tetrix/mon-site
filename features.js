// Applies config.js to the page. Nothing to edit here.
// Preview before launch: open index.html?preview (stays on for this browser tab; index.html?preview=off turns it off).
(function () {
  var S = window.SITE || {};
  var showOffer = !!S.showOffer, showTools = !!S.showTools;
  try {
    var q = location.search;
    if (/[?&]preview=off\b/.test(q)) sessionStorage.removeItem("preview");
    else if (/[?&]preview\b/.test(q)) sessionStorage.setItem("preview", "1");
    if (sessionStorage.getItem("preview") === "1") { showOffer = true; showTools = true; }
  } catch (e) {}
  var h = document.documentElement;
  if (!showOffer) h.classList.add("no-offer");
  if (!showTools) h.classList.add("no-tools");
  // the two tool pages are not reachable while the tools are switched off
  if (!showTools && /(transformation-readiness|rfp-checklist)/.test(location.pathname)) location.replace("index.html");
})();
