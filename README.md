# Frontend - Système de Coordination des Urgences

Application Next.js pour le système de coordination des urgences nationales.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ et npm/yarn
- Les services backend doivent être en cours d'exécution (voir le README du backend)

### Installation

1. Installer les dépendances:
```bash
npm install
# ou
yarn install
```

2. Créer un fichier `.env.local` (optionnel):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Lancer le serveur de développement:
```bash
npm run dev
# ou
yarn dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 Structure du projet

```
frontend/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Tableau de bord
│   ├── incidents/         # Gestion des incidents
│   ├── map/               # Carte interactive
│   ├── notifications/     # Alertes officielles
│   ├── profile/           # Profil utilisateur
│   ├── login/             # Page de connexion
│   └── register/          # Page d'inscription
├── components/            # Composants réutilisables
│   ├── Layout.tsx         # Layout principal avec navigation
│   └── IncidentMap.tsx   # Composant carte Leaflet
├── contexts/              # Contextes React
│   └── AuthContext.tsx    # Gestion de l'authentification
├── lib/                   # Utilitaires
│   └── api.ts             # Client API et fonctions API
└── types/                 # Types TypeScript
    └── index.ts           # Définitions de types
```

## 🔑 Comptes de test

Selon la configuration du backend:

- **Super Admin**: admin@urgence.tn / admin123
- **Admin Régional**: admin.tunis@urgence.tn / admin123
- **Citoyen**: citoyen@test.tn / citoyen123

## 🎨 Fonctionnalités

### Pour les citoyens:
- ✅ Connexion/Inscription
- ✅ Signaler un incident (urgence vitale ou problème civil)
- ✅ Voir l'historique de ses signalements
- ✅ Visualiser les incidents sur une carte interactive
- ✅ Consulter les alertes officielles

### Pour les administrateurs:
- ✅ Toutes les fonctionnalités citoyen
- ✅ Gérer les incidents (changer le statut)
- ✅ Créer et gérer les alertes officielles
- ✅ Voir tous les incidents du système

## 🛠️ Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **React Leaflet** - Cartes interactives
- **Axios** - Client HTTP
- **React Hot Toast** - Notifications
- **Lucide React** - Icônes

## 📝 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run start` - Lancer le serveur de production
- `npm run lint` - Lancer ESLint

## 🔧 Configuration

L'URL de l'API par défaut est `http://localhost:8080` (API Gateway).

Pour changer l'URL de l'API, créez un fichier `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://votre-url-api:8080
```

## 📱 Responsive

L'application est entièrement responsive et fonctionne sur:
- Desktop
- Tablette
- Mobile

## 🐛 Dépannage

### Erreur de connexion à l'API
- Vérifiez que les services backend sont en cours d'exécution
- Vérifiez que l'API Gateway est accessible sur le port 8080
- Vérifiez la configuration CORS dans le backend

### Erreur d'authentification
- Vérifiez que le token JWT est valide
- Vérifiez que les cookies sont activés dans votre navigateur

### Carte ne s'affiche pas
- Vérifiez que Leaflet CSS est chargé
- Vérifiez la console du navigateur pour les erreurs

## 📄 Licence

Ce projet fait partie du système de coordination des urgences nationales.

