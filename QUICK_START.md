# 🚀 Guide de démarrage rapide

## Installation et lancement

1. **Installer les dépendances:**
   ```bash
   npm install
   ```

2. **Vérifier que les services backend sont en cours d'exécution:**
   - Service Discovery (port 8761)
   - API Gateway (port 8080)
   - Tous les autres services

3. **Lancer le frontend:**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur:**
   - http://localhost:3000

## Première connexion

Utilisez un des comptes de test:

- **Super Admin**: 
  - Email: `admin@urgence.tn`
  - Password: `admin123`

- **Citoyen**: 
  - Email: `citoyen@test.tn`
  - Password: `citoyen123`

## Fonctionnalités disponibles

### Pour tous les utilisateurs:
- ✅ Connexion/Inscription
- ✅ Tableau de bord avec statistiques
- ✅ Liste des incidents
- ✅ Signaler un nouvel incident
- ✅ Carte interactive des incidents
- ✅ Alertes officielles
- ✅ Profil utilisateur

### Pour les administrateurs:
- ✅ Panneau d'administration
- ✅ Gestion des incidents (via API)
- ✅ Création d'alertes (via API)

## Structure des pages

- `/` - Redirection automatique (login ou dashboard)
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/dashboard` - Tableau de bord principal
- `/incidents` - Liste des incidents
- `/incidents/new` - Signaler un nouvel incident
- `/map` - Carte interactive
- `/notifications` - Alertes officielles
- `/profile` - Profil utilisateur
- `/admin` - Panneau d'administration (admin uniquement)

## Dépannage

### Erreur: "Cannot connect to API"
- Vérifiez que l'API Gateway est accessible sur http://localhost:8080
- Vérifiez que tous les services backend sont en cours d'exécution

### Erreur: "Module not found"
- Supprimez `node_modules` et `.next`
- Réinstallez: `npm install`
- Relancez: `npm run dev`

### La carte ne s'affiche pas
- Vérifiez la console du navigateur
- Assurez-vous que Leaflet CSS est chargé (vérifiez `globals.css`)

## Prochaines étapes

1. Personnaliser les couleurs dans `tailwind.config.js`
2. Ajouter plus de fonctionnalités d'administration
3. Implémenter la gestion des fichiers joints pour les incidents
4. Ajouter des notifications en temps réel
5. Améliorer la carte avec plus de fonctionnalités

