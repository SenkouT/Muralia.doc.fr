# BikeBuilder.com

Configurateur vélo statique complet avec moteur de compatibilité, comparaison de prix et sauvegarde des configurations.

**URL de production :** https://bikebuilder.com/

## Démarrage rapide

Le projet ne nécessite pas d'installation. Servez les fichiers avec un serveur HTTP statique :

```bash
# Python 3
python -m http.server 8080

# Node.js (avec http-server)
http-server -p 8080

# PHP
php -S localhost:8080
```

Ouvrez <http://localhost:8080>

## Fonctionnalités implémentées

### ✅ 10 catégories de composants

Cadre, Fourche, Roues, Pneus, Transmission, Freinage, Cockpit, Selle, Pédales, Accessoires

### ✅ Moteur de compatibilité automatique

Vérification de 6 points d'intégration critiques :
- Cadre ↔ Fourche (diamètre jeu de direction, taille roue)
- Cadre ↔ Roues (taille)
- Roues ↔ Pneus (diamètre)
- Cadre ↔ Transmission (standard boîtier pédalier)
- Transmission ↔ Cockpit (2x nécessite cintre route)
- Cadre ↔ Freinage (standard fixation)

### ✅ Interface multi-étapes

- Barre de progression (10 étapes)
- Navigation avant/arrière
- Total actualisé en temps réel
- Résumé dans panneau latéral

### ✅ Comparaison de prix

- 3 fournisseurs de démonstration
- Frais de livraison inclus
- Meilleure offre mise en évidence
- Architecture PriceProvider extensible

### ✅ Sauvegarde des configurations

- LocalStorage côté client
- Enregistrement avec nom personnalisé
- Persistance entre sessions

### ✅ Responsive design

Bureau, tablette, mobile avec CSS Grid/Flexbox

### ✅ SEO

Canonical, Open Graph, descriptions, structure sémantique

## Architecture

```
index.html          — HTML5 (10 étapes, résumé, offres)
style.css           — CSS3 responsive
bikebuilder-full.js — Données, compatibilité, prix, storage
app.js              — Contrôleur UI et navigation
```

### Modèle PriceProvider

Les fournisseurs suivent une interface simple extensible :
```javascript
{ id, name, delivery, multiplier, shipping, returnDays, total }
```

## Limitations actuelles

- Pas de base de données (localStorage)
- Pas d'authentification utilisateur
- Données de test seulement (clairement marquées)
- Pas d'API vendeurs réelle
- Pas de panier/checkout

## Roadmap

**Phase 2** — Next.js + Prisma + PostgreSQL + API

**Phase 3** — APIs vendeurs réelles, panier optimisé

**Phase 4** — Recherche, filtres, favoris, notifications

## Points d'intégration clés

- **Compatibilité** : `bikebuilder-full.js` → `getCompatibilityStatus(bike)`
- **UI/Navigation** : `app.js` → gestion des étapes
- **Données produits** : `bikebuilder-full.js` → `bikeComponents`
- **Fournisseurs** : `bikebuilder-full.js` → `demoPriceProviders`

---

Statut : **MVP complet** · Prêt pour migration architecture full-stack
