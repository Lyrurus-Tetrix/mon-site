import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

// Copy the editable root config and features scripts into Astro's public assets.
await copyFile(new URL('../config.js', import.meta.url), new URL('../public/config.js', import.meta.url));
await copyFile(new URL('../features.js', import.meta.url), new URL('../public/features.js', import.meta.url));

// Keep standalone page sources in src/content/legacy-pages and expose generated
// language-specific copies through Astro's public directory.
const legacyPages = ['contact.html', 'rfp-checklist.html', 'transformation-readiness.html'];
const siteUrl = 'https://arnaud.gavanier.com';
const siteConfig = await readFile(new URL('../config.js', import.meta.url), 'utf8');
const showTools = readBooleanOption('showTools');
const showContactForm = readBooleanOption('showContactForm');

const pageSeo = {
  'contact.html': {
    en: { title: 'Contact | Arnaud Gavanier', heading: 'Get in touch', description: 'Planning a transformation or preparing an SAP S/4HANA RFP? Contact Arnaud Gavanier to discuss your program.' },
    fr: { title: 'Contact | Arnaud Gavanier', heading: 'Me contacter', description: 'Vous préparez une transformation ou un appel d’offres SAP S/4HANA ? Contactez Arnaud Gavanier pour en discuter.' },
    de: { title: 'Kontakt | Arnaud Gavanier', heading: 'Kontakt aufnehmen', description: 'Planen Sie eine Transformation oder SAP-S/4HANA-Ausschreibung? Kontaktieren Sie Arnaud Gavanier, um Ihr Programm zu besprechen.' },
  },
  'rfp-checklist.html': {
    en: { title: 'SAP ERP RFP Readiness Checklist Generator | Arnaud Gavanier', heading: 'SAP ERP RFP Readiness Checklist Generator', description: 'Build a structured SAP ERP RFP checklist covering S/4HANA scope, implementation approach, vendor demonstrations, AI, and milestones.' },
    fr: { title: 'Générateur de checklist RFP SAP ERP | Arnaud Gavanier', heading: 'Générateur de checklist RFP SAP ERP', description: 'Préparez un appel d’offres SAP ERP avec une checklist couvrant le périmètre S/4HANA, l’approche projet, les démonstrations et les jalons.' },
    de: { title: 'SAP-ERP-RFP-Checklisten-Generator | Arnaud Gavanier', heading: 'SAP-ERP-RFP-Checklisten-Generator', description: 'Erstellen Sie eine strukturierte SAP-ERP-RFP-Checkliste zu S/4HANA-Umfang, Implementierungsansatz, Anbieterdemonstrationen, KI und Meilensteinen.' },
  },
  'transformation-readiness.html': {
    en: { title: 'Business Transformation Maturity & Readiness Assessment | Arnaud Gavanier', heading: 'Business Transformation Maturity and Readiness Assessment', description: 'Assess business transformation maturity and readiness across eight dimensions to identify gaps, risks, and priorities for your program.' },
    fr: { title: 'Évaluation de la maturité et de la préparation à la transformation métier | Arnaud Gavanier', heading: 'Évaluation de la maturité et de la préparation à la transformation métier', description: 'Évaluez la maturité et la préparation de votre transformation métier sur huit dimensions afin d’identifier les écarts, les risques et les priorités.' },
    de: { title: 'Bewertung der Reife und Bereitschaft für die Unternehmenstransformation | Arnaud Gavanier', heading: 'Bewertung der Reife und Bereitschaft für die Unternehmenstransformation', description: 'Bewerten Sie Reifegrad und Bereitschaft Ihrer Unternehmenstransformation in acht Dimensionen, um Lücken, Risiken und Prioritäten zu erkennen.' },
  },
};

for (const page of legacyPages) {
  const source = await readFile(new URL(`../src/content/legacy-pages/${page}`, import.meta.url), 'utf8');
  await writeFile(new URL(`../public/${page}`, import.meta.url), withSeo(source, page, 'en', isPageEnabled(page)));
}

// English is served from the root; only French and German need locale folders.
// Remove the old generated /en aliases so they cannot linger in dev or dist.
await rm(new URL('../public/en/', import.meta.url), { recursive: true, force: true });
for (const locale of ['fr', 'de']) {
  const directory = new URL(`../public/${locale}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  for (const page of legacyPages) {
    const source = await readFile(new URL(`../src/content/legacy-pages/${page}`, import.meta.url), 'utf8');
    await writeFile(new URL(`../public/${locale}/${page}`, import.meta.url), withSeo(source, page, locale, isPageEnabled(page)));
  }
}

function readBooleanOption(name) {
  const match = siteConfig.match(new RegExp('\\b' + name + '\\s*:\\s*(true|false)\\b'));
  if (!match) throw new Error(`Could not read the ${name} option from config.js.`);
  return match[1] === 'true';
}

function isPageEnabled(page) {
  return page === 'contact.html' ? showContactForm : showTools;
}

function withSeo(html, page, locale, enabled) {
  const metadata = pageSeo[page]?.[locale];
  if (!metadata) throw new Error(`Missing ${locale} SEO metadata for ${page}.`);
  const href = (lang) => siteUrl + '/' + (lang === 'en' ? '' : lang + '/') + page;
  const alternates = ['en', 'fr', 'de']
    .map((lang) => '<link rel="alternate" hreflang="' + lang + '" href="' + href(lang) + '">')
    .concat('<link rel="alternate" hreflang="x-default" href="' + href('en') + '">')
    .join('\n');
  const canonical = '<link rel="canonical" href="' + href(locale) + '">';
  const localeTag = { en: 'en_US', fr: 'fr_FR', de: 'de_DE' }[locale];
  const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const pageUrl = href(locale);
  const seoTags = [
    `<meta name="description" content="${description}">`,
    canonical,
    alternates,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${pageUrl}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:image" content="${siteUrl}/og-image.jpg">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:locale" content="${localeTag}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    enabled ? '' : '<meta name="robots" content="noindex,follow">',
  ].filter(Boolean).join('\n');
  const withLanguage = html.replace(/<html lang="[^"]*">/, `<html lang="${locale}">`);
  const withoutOldDescription = withLanguage.replace(/\s*<meta\s+name="description"[^>]*>/i, '');
  const withTitle = withoutOldDescription.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  const withSeoTags = withTitle.replace('</head>', `${seoTags}\n</head>`);
  const heading = escapeHtml(metadata.heading);
  return withSeoTags.replace(/<h1([^>]*data-i="(?:t|title)"[^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${heading}</h1>`);
}
