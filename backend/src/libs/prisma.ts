import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Instance unique du client Prisma partagée dans toute l'application.
 *
 * PrismaPg est l'adaptateur qui connecte Prisma au driver natif PostgreSQL (pg).
 * L'URL de connexion est lue depuis la variable d'environnement DATABASE_URL.
 *
 * Ce fichier est importé par tous les repositories qui ont besoin d'accéder à la base.
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
