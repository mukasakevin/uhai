# Centre UHAI — Site Web

Site officiel du Centre UHAI (HRL — Healing, Rebuilding and Living), organisation non gouvernementale œuvrant en République Démocratique du Congo.

## Stack technique

- **Backend :** Node.js + Express.js
- **Base de données :** SQLite (via `sqlite3`)
- **Frontend :** HTML5, CSS3 vanilla, JavaScript ES6+
- **CMS :** JSON-based (`data/site_content.json`) + API REST

## Structure du projet

```
Uhai/
├── server.js              ← Point d'entrée du serveur
├── init-db.js             ← Initialisation de la base de données
├── src/
│   ├── data/seed.js       ← Source unique des données initiales
│   ├── db.js              ← Connexion SQLite et helpers CRUD
│   ├── middleware/auth.js ← Authentification admin
│   └── routes/
│       ├── public.js      ← API publique (/api/causes, /api/site-content)
│       ├── admin.js       ← API admin sécurisée (/api/admin/*)
│       └── pages.js       ← Routes HTML
├── scripts/               ← Scripts utilitaires (débogage, tests)
├── data/                  ← Données persistantes (hors git pour .db)
│   ├── causes.json        ← Fallback JSON
│   └── site_content.json  ← Configuration CMS du site
└── public/
    ├── *.html             ← Pages du site
    ├── css/style.css      ← Styles globaux
    ├── js/
    │   ├── cms.js         ← Chargement CMS dynamique
    │   ├── ui.js          ← Composants UI partagés
    │   └── main.js        ← Logique spécifique aux pages
    └── images/            ← Assets visuels
```

## Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env et changer ADMIN_PASSWORD

# Initialiser la base de données
node init-db.js

# Lancer le serveur
npm start
```

## Accès admin

- URL : `/admin`
- Le mot de passe est défini dans `.env` → `ADMIN_PASSWORD`

## API

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/causes` | Liste des 7 objectifs |
| GET | `/api/site-content` | Configuration CMS globale |
| POST | `/api/admin/login` | Authentification admin |
| GET/POST/PUT/DELETE | `/api/admin/causes` | CRUD des objectifs (auth requise) |
| PUT | `/api/admin/site-content` | Mise à jour CMS (auth requise) |
| POST | `/api/admin/upload` | Upload d'image (auth requise) |
