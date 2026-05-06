# Le Cercle des Lecteurs

Plateforme communautaire dédiée aux bibliophiles. Elle permet de gérer sa bibliothèque personnelle, rejoindre des cercles de lecture, participer à des événements littéraires et échanger en privé avec d'autres lecteurs.

---

## Fonctionnalités

- **Bibliothèque** — catalogue de livres avec recherche, filtres par genre et note, ajout de nouveaux titres
- **Avis & notes** — système de critiques avec notation par étoiles et calcul de moyenne
- **Groupes** — cercles de lecture publics ou sur invitation, discussions internes, liste des membres
- **Événements** — événements littéraires organisés par les groupes avec lien d'inscription
- **Messagerie privée** — conversations directes entre membres, accessible depuis n'importe quel profil
- **Profil utilisateur** — statistiques personnelles (lectures, avis, abonnés), photo et biographie
- **Blog** — articles rédigés par les membres de la communauté
- **Authentification** — inscription, connexion via JWT stocké en cookie HttpOnly, refresh automatique

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Base de données | PostgreSQL, Prisma ORM |
| Authentification | JWT (cookie HttpOnly) |
| Infrastructure | Docker, Docker Compose |

---

## Prérequis

Avant d'installer le projet, vérifier que les outils suivants sont disponibles sur la machine :

- [Docker](https://www.docker.com/) (version 24+) et Docker Compose
- [Make](https://www.gnu.org/software/make/) — généralement préinstallé sur Linux/macOS

Vérification :

```bash
docker --version
make --version
```

---

## Installation en local

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd le-cercle-des-lecteurs
```

### 2. Créer le fichier d'environnement

Copier le fichier d'exemple et le remplir avec les valeurs souhaitées :

```bash
cp .env.example .env.dev
```

Ouvrir `.env.dev` et ajuster les valeurs :

```env
# Base de données
POSTGRES_USER=mon_utilisateur
POSTGRES_PASSWORD=mon_mot_de_passe
POSTGRES_DB=cercle_lecteurs
DATABASE_URL=postgresql://mon_utilisateur:mon_mot_de_passe@db:5432/cercle_lecteurs

# Adminer (interface BDD)
ADMINER_PORT=8080

# Backend
BACKEND_PORT=3000
BACKEND_JWT_REFRESH_SECRET=une_clé_secrète_à_changer
BACKEND_JWT_REFRESH_TTL=604800
BACKEND_CORS_ALLOWED=http://localhost:5173

# Frontend
FRONTEND_PORT=5173
FRONTEND_VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Démarrer l'application

```bash
make startdev
```

Cette commande construit et démarre les 4 containers : base de données, backend, frontend et Adminer.

### 4. Peupler la base de données (première fois)

Dans un second terminal, une fois les containers démarrés :

```bash
make seed
```

Cela insère les données de démonstration (utilisateurs, livres, groupes, événements...).

### 5. Accéder à l'application

| Service | URL |
|---|---|
| Application | http://localhost:5173 |
| API backend | http://localhost:3000/api |
| Adminer (BDD) | http://localhost:8080 |

---

## Commandes disponibles

```bash
make startdev       # Démarre l'environnement de développement (hot reload)
make kill-dev       # Arrête et supprime les containers + volumes dev

make startpreprod   # Démarre en mode préproduction (build réel)
make kill-preprod   # Arrête la préproduction

make startprod      # Démarre en mode production
make kill-prod      # Arrête la production

make seed           # Insère les données de démonstration
make migrate        # Applique les migrations Prisma
make migrate-dev    # Crée une nouvelle migration (mode dev)
```

---

## Structure du projet

```
.
├── backend/                 # API Express + Prisma
│   ├── src/
│   │   ├── controllers/     # Handlers des routes
│   │   ├── services/        # Logique métier
│   │   ├── repositories/    # Accès base de données
│   │   ├── routes/          # Définition des endpoints
│   │   ├── middlewares/     # Auth, validation
│   │   └── validators/      # Schémas Zod
│   └── prisma/              # Schéma BDD et migrations
│
├── frontend/                # Application React
│   └── src/
│       ├── Pages/           # Pages de l'application
│       ├── components/      # Composants réutilisables
│       ├── hooks/           # Hooks custom (logique métier)
│       ├── context/         # Contexte d'authentification
│       └── services/        # Client API
│
├── doc/                     # Documentation du projet
├── compose.yml              # Docker Compose base
├── compose.dev.yml          # Surcharge développement
├── compose.preprod.yml      # Surcharge préproduction
├── .env.example             # Template des variables d'environnement
└── Makefile                 # Commandes de gestion du projet
```

---

## Lancer les tests

**Backend** (Vitest) :

```bash
docker exec -it projetlecercledeslecteursaveclaurent-backend-1 pnpm test
```

**Frontend** (Vitest + Testing Library + MSW) :

```bash
cd frontend
pnpm test
```

---

## Documentation

Le dossier `doc/` contient l'ensemble de la documentation du projet :

- `Cahier des charges` — spécifications fonctionnelles
- `Schéma pour BDD` — MCD, MLD, UML
- `Diagramme` — diagrammes d'architecture
- `User_stories` — récits utilisateurs
- `maquette` — maquettes de l'interface
- `Manuel utilisateur` — guide d'utilisation de l'application
