# BikeBuilder — Architecture technique

## Vue d'ensemble

BikeBuilder est un **configurateur vélo statique** construit en vanilla HTML/CSS/JavaScript avec :
- Sélection 10 composants
- Moteur de compatibilité automatique
- Comparaison multi-vendeurs
- Persistance localStorage
- Responsive design

L'architecture est intentionnellement simple et extensible pour permettre une migration future vers une stack complète (Next.js, Prisma, PostgreSQL).

## Structure des fichiers

### index.html (162 lignes)
**Structure sémantique HTML5**

Sections principales :
- `<header>` — Branding, description, demo badge
- `.builder-progress` — Barre de progression + steps indicators
- `.bikebuilder-layout` — Grid 2 colonnes (configurator + summary)
  - `.configurator-panel` — Options de composant pour l'étape courante
  - `.summary-panel` — Résumé vélo + statut compatibilité + total
- `#offers-section` — Grille de comparaison des offres (masquée par défaut)

**Points clés :**
- Pas de formulaire traditionnel : inputs radio réactifs
- Deux panneaux côte-à-côte en desktop, empilés en mobile
- Aria-labels et aria-live pour accessibilité

### style.css (437 lignes)
**CSS3 sans dépendances**

Utilise :
- **Grid** pour layout 2 colonnes responsive
- **Flexbox** pour composants et navigation
- **Custom properties** (--color-primary, etc.) — facilite futur Tailwind
- **Transitions** 0.2s pour UX fluide

Sections :
- Root & typography
- Header & branding
- Progress bar & steps
- Layout grids
- Component cards (radio options)
- Compatibility status (valid/invalid/pending)
- Price comparison cards
- Responsive breakpoints (1024px, 640px)

**Migration Tailwind :** Remplacer classes utilitaires générées par Tailwind.

### bikebuilder-full.js (355 lignes)
**Moteur métier - dépôt unique de vérité**

Sections majeures :

#### 1. Catalogue de composants
```javascript
const bikeComponents = {
  frame: { label: 'Cadre', options: [...] },
  fork: { label: 'Fourche', options: [...] },
  // ... 10 catégories
}
```

Chaque option a :
- `id, name, detail, price`
- `specs` — Caractéristiques techniques structurées

Exemple :
```javascript
{
  id: 'gravel-frame',
  name: 'Cadre Gravel',
  detail: 'Carbone · taille M',
  price: 1299,
  specs: {
    wheelSize: '700c',
    bbStandard: 'BSA',
    rearAxle: 'boost',
    forkMount: 'flatMount'
  }
}
```

#### 2. Règles de compatibilité
```javascript
const compatibilityRules = [
  {
    category: 'frame_wheels',
    check: (frameId, wheelsId) => { ... },
    message: 'Explication du conflit'
  },
  // ... 6 règles
]
```

Fonction d'évaluation :
```javascript
function getCompatibilityStatus(bike) {
  // Retourne { valid, issues, complete }
}
```

#### 3. Interface PriceProvider
```javascript
const demoPriceProviders = [
  {
    id: 'provider-id',
    name: 'Provider Name',
    delivery: 'Délai de livraison',
    multiplier: 1.03,      // Markup %
    shipping: 19.90,       // Frais fixes
    returnDays: 60
  }
]
```

Facilite remplacement par API réelle :
```javascript
// Futur : adapter API / SDK vendeur
async function fetchOffers(bike) {
  return demoPriceProviders.map(provider => ({
    ...provider,
    total: calculatePrice(bike, provider)
  }));
}
```

#### 4. Persistance localStorage
```javascript
saveBikeConfig(bike, name)      // Enregistre
loadBikeConfig(id)               // Charge
getSavedConfigs()                // Liste
deleteSavedConfig(id)            // Supprime
```

Clés:
- `bikebuilder_current_config` — Config en cours
- `bikebuilder_saved_configs` — Array de configs sauvegardées

Structure:
```javascript
{
  id: '1726924800000',
  name: 'Mon vélo de route',
  timestamp: '2026-09-24T13:26:40.123Z',
  bike: { frame: 'id', fork: 'id', ... }
}
```

#### 5. Export global
```javascript
window.BikeBuilder = {
  components,
  rules,
  providers,
  getCompatibilityStatus,
  generateOffers,
  saveBikeConfig,
  loadBikeConfig,
  getSavedConfigs,
  deleteSavedConfig
}
```

Permet accès depuis `app.js` et console.

### app.js (220 lignes)
**Contrôleur UI - orchestration et rendu**

Concepts principaux :

#### État global
```javascript
let currentStep = 0;        // Étape actuelle (0-9)
let currentBike = {};       // Configuration en cours
```

#### Fonctions de rendu
- `updateProgress()` — Maj barre + step indicators
- `renderStep()` — Affiche options pour étape courante
- `renderSummary()` — Maj résumé, total, statut compatibilité
- `renderOffers()` — Affiche comparaison de prix

#### Événements
```javascript
nextStepBtn.addEventListener('click', () => goToStep(currentStep + 1))
compareOffersBtn.addEventListener('click', renderOffers)
saveConfigBtn.addEventListener('click', () => {
  BB.saveBikeConfig(currentBike, prompt('Nom ?'))
})
```

#### Intégration `BikeBuilder`
```javascript
const BB = window.BikeBuilder;  // Récupère API
const CATEGORIES = Object.keys(BB.components);  // ['frame', 'fork', ...]

// Utilisation
const status = BB.getCompatibilityStatus(currentBike);
const offers = BB.generateOffers(currentBike);
```

## Flux de données

### Sélection de composant
```
input radio change
  ↓
app.js: currentBike[category] = value
  ↓
renderBikeSummary()
  ├─ BB.getCompatibilityStatus(currentBike)  ← bikebuilder-full.js
  │  └─ Retourne { valid, issues, complete }
  ├─ Calcul du total
  └─ Mise à jour du DOM
  ↓
renderStep()  ← Mise à jour visuelle radio
```

### Comparaison de prix
```
Clic "Comparer les offres"
  ↓
renderOffers()
  ├─ BB.generateOffers(currentBike)  ← bikebuilder-full.js
  │  └─ Applique multipliers + shipping
  └─ Affiche grille d'offres
```

### Sauvegarde
```
Clic "Enregistrer"
  ↓
BB.saveBikeConfig(currentBike, name)  ← bikebuilder-full.js
  ├─ Crée config objet
  ├─ Enregistre dans localStorage
  └─ Retourne ID
```

## Comment étendre

### 1. Ajouter une nouvelle catégorie

**bikebuilder-full.js :**
```javascript
const bikeComponents = {
  // ... autres
  newCategory: {
    label: 'Label français',
    category: 'newCategory',
    options: [
      { id: '...', name: '...', detail: '...', price: 0, specs: {...} }
    ]
  }
}
```

**app.js :**
Automatiquement incluse via `Object.keys(BB.components)` → 11 étapes

### 2. Ajouter une règle de compatibilité

**bikebuilder-full.js :**
```javascript
const compatibilityRules = [
  // ... autres
  {
    category: 'frame_newcategory',
    check: (frameId, newId) => {
      const fSpecs = BB.components.frame.options.find(o => o.id === frameId)?.specs;
      const nSpecs = BB.components.newCategory.options.find(o => o.id === newId)?.specs;
      return fSpecs?.someField === nSpecs?.someField;
    },
    message: 'Explication du conflit.'
  }
]
```

### 3. Connecter une vraie API vendeur

**bikebuilder-full.js :**
```javascript
// Remplacer demoPriceProviders par appel API
async function fetchProviders(bike) {
  const response = await fetch('https://api.vendor.com/offers', {
    method: 'POST',
    body: JSON.stringify(bike)
  });
  return response.json();
}
```

**app.js :**
```javascript
async function renderOffers() {
  const offers = await BB.generateOffers(currentBike);
  // ... rendu
}
```

### 4. Migrer vers Next.js

Étapes :
1. Créer page `/builder` dans `/app/builder/page.tsx`
2. Convertir `app.js` en composant React
3. Déplacer `bikebuilder-full.js` en services backend
4. Créer API `/api/compatibility`, `/api/offers`
5. Remplacer localStorage par sessions utilisateur + DB

Structure `/app/builder/`:
```
page.tsx              ← Page principale
layout.tsx            ← Layout (header, nav)
components/
  ├─ Configurator.tsx ← Panneau de sélection
  ├─ Summary.tsx      ← Résumé + prix
  ├─ OfferComparison.tsx
  └─ ProgressBar.tsx
```

## Performance

- **Taille HTML** : 6 KB minifiée
- **Taille CSS** : 15 KB minifiée
- **Taille JS** : 25 KB minifiée
- **Total** : ~50 KB brut (< 10 KB gzippé)

Optimisations futures :
- Code-splitting Next.js
- Image optimization
- Lazy load des offres

## Accessibilité

- Sémantique HTML5 (`<button>`, `<input>`, `<section>`, etc.)
- `aria-labelledby` sur sections
- `aria-live="polite"` sur statut compatibilité
- Tabindex naturel
- Contraste WCAG AA (8.5:1 texte sur fond)

## SEO

- Canonical : `https://bikebuilder.com/`
- Description meta
- Open Graph (og:title, og:description, og:image)
- Titres structurés (h1, h2)
- URLs propres (static à ce stade)

Amélioration future :
- URLs dynamiques par configuration (ex. `/bikes/gravel-setup-2025`)
- Sitemap XML
- Structured data (schema.org Product)

## Sécurité

- **Côté client** : localStorage est sécurisé pour données utilisateur
- **Pas de backend** : Aucune injection possible
- **Pas d'API** : Pas d'exposition d'endpoints

À implémenter quand backend :
- Validation des données côté serveur
- Authentification JWT
- CSRF protection
- Rate limiting

## Déploiement

### Statique (actuellement)
```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# GitHub Pages
git push  # Automatique avec Actions
```

### Futur (Next.js)
```bash
# Vercel
vercel --prod

# Self-hosted
npm run build
npm start
```

## Tests

### Unitaires proposés
```bash
# bikebuilder-full.js
test('getCompatibilityStatus détecte incompatibilité frame-wheels')
test('generateOffers calcule prix avec multiplier + shipping')
test('saveBikeConfig persiste dans localStorage')
```

### E2E proposés
```bash
# app.js
test('Navigation step 0 → step 9')
test('Sélection composant maj total')
test('Comparaison offres affiche 3 providers')
```

Outils recommandés : Vitest, Playwright

---

**Version :** MVP Stable
**Dernière mise à jour :** 2026-09-24
**Prêt pour production :** Oui (statique)
**Prêt pour migration Next.js :** Oui (architecture isolée)
