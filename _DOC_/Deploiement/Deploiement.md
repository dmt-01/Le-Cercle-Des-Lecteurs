# Guide de déploiement — Le Cercle des Lecteurs

Ce document décrit les étapes pour déployer l'application dans les trois environnements disponibles : **développement**, **préproduction** et **production**.

---

## Prérequis

- [Docker](https://www.docker.com/) version 24+ et Docker Compose
- [Make](https://www.gnu.org/software/make/)
- Accès au dépôt Git

Vérification :

```bash
docker --version
docker compose version
make --version
```

---

## Environnements disponibles

| Environnement | Commande | Fichier env | Adminer | Hot reload |
|---|---|---|---|---|
| Développement | `make startdev` | `.env.dev` | ✓ port 8080 | ✓ |
| Préproduction | `make startpreprod` | `.env.preprod` | ✓ port 8080 | ✗ |
| Production | `make startprod` | `.env.prod` | ✗ | ✗ |

---

## 1. Déploiement en développement

### Étape 1 — Créer le fichier d'environnement

```bash
cp .env.example .env.dev
```

Éditer `.env.dev` avec les valeurs locales. Les valeurs par défaut fonctionnent telles quelles pour un environnement local.

### Étape 2 — Démarrer les containers

```bash
make startdev
```

Démarre : base de données, backend (hot reload via `tsx watch`), frontend (Vite dev server), Adminer.

### Étape 3 — Peupler la base de données (première fois uniquement)

```bash
make seed
```

### Accès

| Service | URL |
|---|---|
| Application | http://localhost:5173 |
| API | http://localhost:3000/api |
| Adminer (BDD) | http://localhost:8080 |

---

## 2. Déploiement en préproduction

La préproduction utilise les mêmes Dockerfiles que la production (build réel, pas de hot reload). Elle ajoute Adminer pour déboguer la base.

### Étape 1 — Créer le fichier d'environnement

```bash
cp .env.example .env.preprod
```

Valeurs à adapter :

```env
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=cercle_lecteurs_preprod
DATABASE_URL=postgresql://USER:PASSWORD@db:5432/cercle_lecteurs_preprod

BACKEND_JWT_REFRESH_SECRET=<secret_fort_différent_du_dev>
BACKEND_CORS_ALLOWED=http://localhost:FRONTEND_PORT

FRONTEND_VITE_API_BASE_URL=http://localhost:3000/api
```

### Étape 2 — Démarrer

```bash
make startpreprod
```

> **Important :** `VITE_API_BASE_URL` est injectée dans le bundle JavaScript **au moment du build Docker**, pas à l'exécution. Si cette variable change, il faut reconstruire l'image avec `--build`.

---

## 3. Déploiement en production (VPS OVH)

### Infrastructure

L'application est déployée sur un VPS OVH Ubuntu 24.04 avec l'architecture suivante :

- **Nginx** installé sur le host — reverse proxy HTTPS vers les containers Docker
- **Certbot** — certificat SSL Let's Encrypt sur `lecercledeslecteurs.fr`
- **Docker Compose** — 3 containers : `db`, `backend`, `frontend`

```
Internet → Nginx (host, port 443) → backend (localhost:3000)
                                  → frontend (localhost:8080)
```

### Étape 1 — Cloner le dépôt

```bash
cd /var/www
git clone git@github.com:TON_USER/Le-Cercle-Des-Lecteurs.git
cd Le-Cercle-Des-Lecteurs
```

### Étape 2 — Créer le fichier d'environnement

```bash
nano .env.prod
```

```env
# ─── Base de données ──────────────────────────────────────────────────────────
POSTGRES_USER=<utilisateur_prod>
POSTGRES_PASSWORD=<mot_de_passe_fort>
POSTGRES_DB=cercle_db
DATABASE_URL=postgresql://UTILISATEUR:MOT_DE_PASSE@db:5432/cercle_db

# ─── Backend ──────────────────────────────────────────────────────────────────
BACKEND_PORT=3000
BACKEND_JWT_REFRESH_SECRET=<secret_aléatoire_64_chars_minimum>
BACKEND_JWT_REFRESH_TTL=604800
BACKEND_CORS_ALLOWED=https://lecercledeslecteurs.fr

# ─── Frontend ─────────────────────────────────────────────────────────────────
FRONTEND_PORT=8080
FRONTEND_VITE_API_BASE_URL=https://lecercledeslecteurs.fr/api
```

#### Générer un secret JWT solide

```bash
openssl rand -base64 64
```

### Étape 3 — Démarrer les containers

```bash
make startprod
```

### Étape 4 — Configurer Nginx (reverse proxy)

Fichier `/etc/nginx/sites-available/lecercledeslecteurs.fr` :

```nginx
server {
    server_name lecercledeslecteurs.fr;
    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/lecercledeslecteurs.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lecercledeslecteurs.fr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}

server {
    if ($host = lecercledeslecteurs.fr) {
        return 301 https://$host$request_uri;
    }
    server_name lecercledeslecteurs.fr;
    listen 80;
    listen [::]:80;
    return 404;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Étape 5 — Peupler la base de données (première fois uniquement)

```bash
docker run --rm \
  --network le-cercle-des-lecteurs_default \
  --env-file /var/www/Le-Cercle-Des-Lecteurs/.env.prod \
  -v /var/www/Le-Cercle-Des-Lecteurs/backend:/app \
  -w /app \
  node:23-alpine3.21 \
  sh -c "npm install -g pnpm && pnpm install && pnpm prisma generate && pnpm seed"
```

> **Attention :** Ne pas exécuter le seed en production si des données utilisateurs existent déjà — il écrase les données existantes.

### Ce qui se passe au démarrage

1. Docker construit les images (multi-stage build)
2. PostgreSQL démarre et passe son healthcheck
3. Le backend attend PostgreSQL (`depends_on: condition: service_healthy`)
4. **Les migrations Prisma sont appliquées automatiquement** (`prisma migrate deploy`) avant le démarrage du serveur
5. Le serveur Express démarre (`node dist/index.js`)
6. Nginx (dans le container frontend) sert les fichiers statiques React sur le port 8080

> Les migrations sont idempotentes : elles ne ré-appliquent que celles qui n'ont pas encore été jouées.

---

## 4. Pipeline CI/CD (GitHub Actions)

La pipeline se déclenche à chaque push sur `main` ou `staging`.

### Comportement par branche

| Branche | Tests | Déploiement |
|---|---|---|
| `staging` | ✓ | ✗ |
| `main` | ✓ | ✓ (si tests passent) |

### Secrets GitHub à configurer

Aller dans **Settings → Secrets and variables → Actions** du repo GitHub et ajouter :

| Nom | Valeur |
|---|---|
| `VPS_HOST` | IP du VPS OVH |
| `VPS_USER` | `ubuntu` |
| `VPS_SSH_KEY` | Contenu de la clé privée SSH (`cat ~/.ssh/id_ed25519`) |
| `VPS_PORT` | Port SSH du VPS |

### Fichier `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD

on:
  push:
    branches: [main, staging]

jobs:
  test-backend:
    name: Tests backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
          run_install: false
      - uses: actions/setup-node@v4
        with:
          node-version: 23
          cache: pnpm
          cache-dependency-path: backend/pnpm-lock.yaml
      - name: Installer les dépendances
        working-directory: backend
        run: pnpm install
      - name: Générer le client Prisma
        working-directory: backend
        run: pnpm prisma generate
      - name: Lancer les tests
        working-directory: backend
        run: pnpm test

  test-frontend:
    name: Tests frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
          run_install: false
      - uses: actions/setup-node@v4
        with:
          node-version: 23
          cache: pnpm
          cache-dependency-path: frontend/pnpm-lock.yaml
      - name: Installer les dépendances
        working-directory: frontend
        run: pnpm install
      - name: Lancer les tests
        working-directory: frontend
        run: pnpm test --run

  deploy:
    name: Déploiement VPS
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Déployer sur le VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            set -e
            cd /var/www/Le-Cercle-Des-Lecteurs
            git pull origin main
            make deploy
```

---

## 5. Migrations de base de données

### Appliquer les migrations (prod/preprod)

Les migrations sont **automatiques** au démarrage du container backend grâce à la commande dans `Dockerfile.prod` :

```dockerfile
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/index.js"]
```

### Créer une nouvelle migration (dev uniquement)

```bash
make migrate-dev
```

Crée un nouveau fichier dans `backend/prisma/migrations/` à commiter dans Git.

### Peupler la base (dev/preprod)

```bash
make seed
```

---

## 6. Mise à jour de l'application

### Via la pipeline CI/CD (recommandé)

Pousser sur `main` déclenche automatiquement les tests puis le déploiement si tout est vert.

### Manuellement sur le VPS

```bash
cd /var/www/Le-Cercle-Des-Lecteurs
git pull origin main
make deploy
```

`make deploy` rebuild uniquement le backend et le frontend **sans toucher à la base de données**.

> Ne jamais utiliser `make kill-prod` sur le serveur de production — cette commande supprime les volumes et efface toutes les données.

---

## 7. Sauvegarde et restauration

### Sauvegarder la base PostgreSQL

```bash
docker exec le-cercle-des-lecteurs-db-1 \
  pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup_$(date +%Y%m%d).sql
```

### Restaurer une sauvegarde

```bash
docker exec -i le-cercle-des-lecteurs-db-1 \
  psql -U $POSTGRES_USER $POSTGRES_DB < backup_20260506.sql
```

---

## 8. Commandes utiles

```bash
# Voir les containers actifs
docker ps

# Voir les logs en temps réel
docker compose logs -f backend
docker compose logs -f frontend

# Redémarrer un container sans rebuild
docker compose --env-file .env.prod restart backend

# Arrêt des services (sans supprimer les volumes)
make kill-dev       # Arrête dev ET supprime les volumes (BDD remise à zéro)
make kill-preprod   # Arrête preprod (conserve les volumes)
make kill-prod      # Arrête prod (conserve les volumes)
```

---

## 9. Architecture des containers

```
┌─────────────────────────────────────────────────────────────────┐
│  VPS OVH                                                        │
│                                                                 │
│  Nginx (host) :443 ──► frontend container :8080                 │
│                  └───► backend container  :3000                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Docker Compose                                         │   │
│  │                                                         │   │
│  │  ┌──────────┐  port 8080  ┌───────────────────────┐    │   │
│  │  │ frontend │◄────────────│ nginx:alpine           │    │   │
│  │  │ React    │             │ fichiers statiques     │    │   │
│  │  └──────────┘             └───────────────────────┘    │   │
│  │                                                         │   │
│  │  ┌──────────┐  port 3000  ┌───────────────────────┐    │   │
│  │  │ backend  │◄────────────│ Express.js             │    │   │
│  │  │ API REST │             │ Node 23 alpine         │    │   │
│  │  └──────────┘             └───────────────────────┘    │   │
│  │       │                                                 │   │
│  │       │ healthcheck                                     │   │
│  │       ▼                                                 │   │
│  │  ┌──────────┐  volume     ┌───────────────────────┐    │   │
│  │  │    db    │◄────────────│ PostgreSQL 17          │    │   │
│  │  │          │             │ db_data (volume)       │    │   │
│  │  └──────────┘             └───────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Checklist avant mise en production

- [ ] `.env.prod` créé et **jamais commité** dans Git (vérifié dans `.gitignore`)
- [ ] `BACKEND_JWT_REFRESH_SECRET` généré avec `openssl rand -base64 64`
- [ ] `BACKEND_CORS_ALLOWED` pointe vers le vrai domaine (pas `localhost`)
- [ ] `FRONTEND_VITE_API_BASE_URL` pointe vers le vrai domaine
- [ ] `FRONTEND_PORT=8080` (port 80 réservé à Nginx sur le host)
- [ ] Les 4 secrets GitHub Actions configurés (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`)
- [ ] Nginx configuré en reverse proxy avec HTTPS (Certbot)
- [ ] `make startprod` testé — les 3 containers passent au statut `healthy` ou `running`
- [ ] L'application est accessible sur `https://lecercledeslecteurs.fr`
- [ ] Le login fonctionne
- [ ] Une sauvegarde de la base de données est planifiée (`cron` + `pg_dump`)