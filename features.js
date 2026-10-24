// Applies config.js to the page. Nothing to edit here.
// Preview before launch: open index.html?preview (stays on for this browser tab; index.html?preview=off turns it off).
(function () {
  var S = window.SITE || {};
  var showOffer = !!S.showOffer, showTools = !!S.showTools, showForm = !!S.showContactForm, showChat = !!S.showChatbot;
  try {
    var q = location.search;
    if (/[?&]preview=off\b/.test(q)) sessionStorage.removeItem("preview");
    else if (/[?&]preview\b/.test(q)) sessionStorage.setItem("preview", "1");
    if (sessionStorage.getItem("preview") === "1") { showOffer = true; showTools = true; showForm = true; showChat = true; }
  } catch (e) {}
  var h = document.documentElement;
  if (!showOffer) h.classList.add("no-offer");
  if (!showTools) h.classList.add("no-tools");
  h.classList.add(showForm ? "form-on" : "form-off");
  // the two tool pages are not reachable while the tools are switched off
  if (!showTools && /(transformation-readiness|rfp-checklist)/.test(location.pathname)) location.replace("index.html");
  // the contact form page is not reachable while the form is switched off
  if (!showForm && /(^|\/)contact(\.html)?\/?$/.test(location.pathname)) location.replace("index.html#contact");
  // Botpress chat bubble: loaded after the page, only where <html data-chatbot> is set, and only if switched on
  if (showChat && S.chatbotInjectUrl && S.chatbotConfigUrl && h.hasAttribute("data-chatbot")) {
    window.addEventListener("load", function () {
      var a = document.createElement("script");
      a.src = S.chatbotInjectUrl;
      a.onload = function () {            // the bot settings must run after the Botpress library is ready
        var b = document.createElement("script");
        b.src = S.chatbotConfigUrl;
        document.head.appendChild(b);
      };
      document.head.appendChild(a);
    });
  }
})();
