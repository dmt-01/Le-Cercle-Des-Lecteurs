# Makefile pour gérer les commandes

# Pour démarrer l'application en mode développement
startdev:
	docker compose --env-file .env.dev up --build

# Pour démarrer l'application en mode préproduction
startpreprod:
	docker compose.preprod.yml --env-file .env.preprod up --build

# Pour démarrer l'application en mode production
startprod:
	docker compose.prod.yml --env-file .env.prod up --build

# Pour arrêter les containers et supprimer les volumes associés
kill:
	docker compose --env-file .env.dev down -v

# Pour peupler la base de données
seed:
	docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm seed

# Pour lancer les migrations
migrate:
	docker exec -it projetlecercledeslecteursavecclement-backend-1 pnpm prisma migrate deploy