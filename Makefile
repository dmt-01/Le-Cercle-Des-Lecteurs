# Makefile pour gérer les commandes

# Pour démarrer l'application en mode développement
startdev: kill
	docker compose --env-file .env.dev up --build

# Pour démarrer l'application en mode préproduction
startpreprod:
	docker compose -f compose.preprod.yml --env-file .env.preprod up --build

# Pour démarrer l'application en mode production
startprod:
	docker compose -f compose.prod.yml --env-file .env.prod up --build

# Pour arrêter les containers et supprimer les volumes associés
kill:
	docker compose --env-file .env.dev down -v

# Pour peupler la base de données
seed:
	cd backend && docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm seed

# Pour lancer les migrations
migrate:
	cd backend && docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm prisma migrate deploy

generate:
	cd backend && docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm prisma generate

# Pour migrer les modification prisma en local
migrate-dev:
	cd backend && pnpm prisma migrate dev --name "migration" --schema ./prisma/schema.prisma

deploy-prisma: migrate-dev migrate generate seed
	@echo "✅ Prisma déployé et BDD peuplée !"