## ─── Installation locale ─────────────────────────────────────────────────────

# Installe les dépendances et génère le client Prisma en local (après un clone)
install:
	cd backend && pnpm install && pnpm prisma generate && pnpm build
	cd frontend && pnpm install

## ─── Démarrage ───────────────────────────────────────────────────────────────

# Mode développement (hot reload, volumes, adminer)
startdev: kill-dev
	docker compose -f compose.yml -f compose.dev.yml --env-file .env.dev up --build -d

# Mode préproduction (build réel, adminer disponible)
startpreprod:
	docker compose -f compose.yml -f compose.preprod.yml --env-file .env.preprod up --build -d

# Mode production (build réel, sans adminer)
startprod:
	docker compose --env-file .env.prod up --build -d

## ─── Arrêt ────────────────────────────────────────────────────────────────────

# Arrête et supprime les containers + volumes du mode dev.
kill-dev:
	docker compose -f compose.yml -f compose.dev.yml --env-file .env.dev down -v

# Arrête la préproduction
kill-preprod:
	docker compose -f compose.yml -f compose.preprod.yml --env-file .env.preprod down

# Arrête la production
kill-prod:
	docker compose --env-file .env.prod down

## ─── Base de données (dev) ────────────────────────────────────────────────────

# Peupler la base avec les données de test
seed:
	docker exec -it projetlecercledeslecteursaveclaurent-backend-1 pnpm seed

# Appliquer les migrations en base
migrate:
	docker exec -it projetlecercledeslecteursaveclaurent-backend-1 pnpm prisma migrate deploy

# Créer une nouvelle migration (dans le container dev)
migrate-dev:
	docker exec -it projetlecercledeslecteursaveclaurent-backend-1 pnpm prisma migrate dev --name "migration" --schema ./prisma/schema.prisma

# Déploiement complet Prisma (migration + génération + seed)
deploy-prisma: migrate-dev migrate seed
	@echo "✅ Prisma déployé et BDD peuplée !"

# Déploiement production (sans toucher à la base de données)
deploy:
	DOCKER_BUILDKIT=1 docker compose --env-file .env.prod up -d --build --no-deps backend frontend

## ─── Tests ────────────────────────────────────────────────────────────────────

# Tests backend (le container dev doit être démarré)
test-back:
	docker exec -it projetlecercledeslecteursaveclaurent-backend-1 pnpm test --run

# Tests frontend (exécutés en local, sans Docker)
test-front:
	cd frontend && pnpm test --run

# Tous les tests : backend puis frontend
test: test-back test-front
	@echo "✅ Tous les tests ont été exécutés !"

# Rapport de couverture pour les tests backend et frontend
test-coverage:
	cd backend && pnpm test:coverage
	cd frontend && pnpm test:coverage
	@echo "✅ Rapport de couverture généré !"