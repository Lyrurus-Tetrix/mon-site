import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const siteConfigPath = fileURLToPath(new URL('./config.js', import.meta.url));
const siteUrl = 'https://arnaud.gavanier.com';
const siteConfig = readFileSync(siteConfigPath, 'utf8');
const readBooleanOption = (name) => {
  const match = siteConfig.match(new RegExp('\\b' + name + '\\s*:\\s*(true|false)\\b'));
  if (!match) throw new Error(`Could not read the ${name} option from config.js.`);
  return match[1] === 'true';
};
const showTools = readBooleanOption('showTools');
const showContactForm = readBooleanOption('showContactForm');
const sitemapPages = ['en', 'fr', 'de'].flatMap((locale) => {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const activePages = [
    ...(showTools ? ['transformation-readiness.html', 'rfp-checklist.html'] : []),
    ...(showContactForm ? ['contact.html'] : []),
  ];
  return activePages.map((page) => `${siteUrl}${prefix}/${page}`);
});
const legacyPages = new Map();
for (const page of ['contact.html', 'rfp-checklist.html', 'transformation-readiness.html']) {
  legacyPages.set('/' + page, fileURLToPath(new URL('./public/' + page, import.meta.url)));
  for (const locale of ['fr', 'de']) {
    legacyPages.set('/' + locale + '/' + page, fileURLToPath(new URL('./public/' + locale + '/' + page, import.meta.url)));
  }
}
const serveSiteConfig = {
  name: 'serve-site-config',
  // Register before Astro's HTML route handling so plain .html requests work
  // with the Accept: text/html header sent by browsers.
  enforce: 'pre',
  configureServer(server) {
    server.middlewares.use('/config.js', (request, response, next) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') return next();
      try {
        const source = readFileSync(siteConfigPath, 'utf8');
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(request.method === 'HEAD' ? '' : source);
      } catch (error) {
        next(error);
      }
    });
    server.middlewares.use((request, response, next) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') return next();
      const pathname = new URL(request.url ?? '/', 'http://localhost').pathname.replace(/\/+$/, '') || '/';
      const pagePath = legacyPages.get(pathname);
      if (!pagePath) return next();
      try {
        const page = readFileSync(pagePath, 'utf8');
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(request.method === 'HEAD' ? '' : page);
      } catch (error) {
        next(error);
      }
    });
  },
};

export default defineConfig({
  site: siteUrl,
  integrations: [sitemap({ customPages: sitemapPages })],
  build: { format: 'directory' },
  // Keep extension-based standalone pages addressable in dev.
  // Astro's static directory build emits localized home pages under /fr/ and /de/.
  trailingSlash: 'always',
  compressHTML: false,
  vite: { plugins: [serveSiteConfig] },
});
