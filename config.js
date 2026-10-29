// Site configuration: the only file you need to edit to launch a feature.
// false = hidden, true = shown. Save, then: git add . / git commit / git push
window.SITE = {
  showOffer: fasle,        // "What I offer" section (the services) and its menu links
  showTools: fasle,        // "Interactive tools": readiness assessment and RFP checklist (section, menu links and the two tool pages)
  showContactForm: fasle,  // false: the contact section links to your Deloitte profile instead; true: the contact form is used
  showChatbot: true,       // Botpress chat bubble on the home page (false = nothing is loaded from Botpress)
  chatbotInjectUrl: "https://cdn.botpress.cloud/webchat/v3.7/inject.js",
  chatbotConfigUrl: "https://files.bpcontent.cloud/2026/10/24/11/20261024111238-IHGIHQ8W.js"   // copy the new address here if you change the bot's look in Botpress
};
