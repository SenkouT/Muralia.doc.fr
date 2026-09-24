# BikeBuilder.com

Configurateur vélo statique pour BikeBuilder.com.

## Lancer le projet

Le projet ne nécessite ni installation ni serveur applicatif. Depuis la racine, servez les fichiers avec un serveur HTTP statique, par exemple :

```bash
python -m http.server 8080
```

Puis ouvrez <http://localhost:8080>. En production, le site est prévu pour être servi sur <https://bikebuilder.com/>.

Le parcours MVP couvre sélection → compatibilité → prix → comparaison. Les prix affichés sont explicitement des **données de test**. Les composants, règles et offres sont regroupés dans `bikebuilder.js`. Les offres suivent le contrat minimal d’un futur `PriceProvider` afin de pouvoir remplacer les fournisseurs de démonstration par des adaptateurs API sans modifier l’interface.

Le domaine public est déclaré dans la balise canonical et les métadonnées Open Graph de `index.html`. La configuration DNS et le déploiement du domaine doivent être réalisés chez l’hébergeur.
