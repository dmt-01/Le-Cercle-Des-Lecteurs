## ─── Démarrage ───────────────────────────────────────────────────────────────

# Mode développement (hot reload, volumes, adminer)
startdev: kill-dev
	docker compose -f compose.yml -f compose.dev.yml --env-file .env.dev up --build

# Mode préproduction (build réel, adminer disponible)
startpreprod:
	docker compose -f compose.yml -f compose.preprod.yml --env-file .env.preprod up --build

# Mode production (build réel, sans adminer)
startprod:
	docker compose --env-file .env.prod up --build

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
	docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm seed

# Appliquer les migrations en base
migrate:
	docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm prisma migrate deploy

# Créer une nouvelle migration (dans le container dev)
migrate-dev:
	docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm prisma migrate dev --name "migration" --schema ./prisma/schema.prisma

# Déploiement complet Prisma (migration + génération + seed)
deploy-prisma: migrate-dev migrate seed
	@echo "✅ Prisma déployé et BDD peuplée !"

## ─── Tests ────────────────────────────────────────────────────────────────────

# Tests backend (le container dev doit être démarré)
test-back:
	docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm test --run

# Tests frontend (exécutés en local, sans Docker)
test-front:
	cd frontend && pnpm test --run

# Tous les tests : backend puis frontend
test: test-back test-front
	@echo "✅ Tous les tests ont été exécutés !"
