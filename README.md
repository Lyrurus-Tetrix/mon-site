# Site d’Arnaud Gavanier

## 1. Prérequis

- Node.js 26 LTS (`node -v` doit afficher une version `v26.x`).
- pnpm 11.25.0. Dans PowerShell, si `pnpm` est bloqué par la stratégie de scripts Windows, utilisez toujours `pnpm.cmd`.

Si pnpm n’est pas installé, installez cette version depuis PowerShell :

```powershell
npm.cmd install --global pnpm@11.25.0
```

## 2. Installer et lancer le site en local

1. Ouvrez **PowerShell**.
2. Allez dans le dossier du projet :

   ```powershell
   Set-Location 'C:\Users\arnau\mon-site2'
   ```

3. Installez les dépendances :

   ```powershell
   pnpm.cmd install --frozen-lockfile
   ```

4. Démarrez le serveur local :

   ```powershell
   pnpm.cmd dev --host 127.0.0.1 --port 4322
   ```

5. Laissez PowerShell ouvert et ouvrez `http://127.0.0.1:4322/` dans Chrome. Les pages française et allemande sont sous `/fr/` et `/de/`.
6. Pour arrêter le serveur, revenez dans PowerShell et appuyez sur **Ctrl + C**.

## Modifier les textes

Les textes de l’accueil sont dans `src/components/Home.astro`. Les traductions anglaise, française et allemande sont dans `src/i18n/en.json`, `src/i18n/fr.json` et `src/i18n/de.json`.

Les pages annexes modifiables sont dans `src/content/legacy-pages/` :
`contact.html`, `rfp-checklist.html` et `transformation-readiness.html`.
Leurs copies dans `public/` sont générées par le script de développement et de build ; ne les modifiez pas directement. L’anglais est servi à la racine, tandis que le français et l’allemand sont servis sous `/fr/` et `/de/`. Le sitemap est également généré à partir de ces URL.

## Configurer les fonctionnalités

Activez ou désactivez les sections, outils, formulaire et chatbot dans le `config.js` à la racine. Le script copie cette configuration et `features.js` vers `public/` pendant le build ; ne modifiez pas ces copies générées.

## Construire et vérifier le site

```powershell
pnpm.cmd build
pnpm.cmd preview --host 127.0.0.1 --port 4322
```

Le site généré se trouve dans `dist/`. Le build local ne publie rien sur Internet.

## Publier

La publication est déclenchée par GitHub Actions après l’envoi d’un commit sur `main`. Avant la première publication Astro, dans le dépôt GitHub, ouvrez **Settings → Pages** et sélectionnez **GitHub Actions** comme source. Vérifiez que le domaine `arnaud.gavanier.com` est toujours configuré. Ne faites cette bascule qu’après validation locale de la nouvelle version. La configuration locale du workflow utilise Node.js 26 LTS.

## Si le build échoue

Lisez le premier message d’erreur de `pnpm.cmd build`, corrigez le problème indiqué, puis relancez la commande. Ne publiez pas tant que le build local ne passe pas.
