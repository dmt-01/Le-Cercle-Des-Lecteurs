import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Middleware générique de validation avec Zod.
 *
 * Utilisation : passer le schéma Zod et la source des données à valider.
 * Si les données sont invalides → réponse 422 avec le détail des erreurs.
 * Si les données sont valides  → la source (body ou query) est remplacée par les données
 *                                parsées et nettoyées, puis la requête continue.
 *
 * @param schema - Schéma Zod à utiliser pour la validation
 * @param source - Source des données : "body" (défaut) ou "query"
 */
export function validate(schema: z.ZodTypeAny, source: "body" | "query" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {

    // Tenter de valider la source choisie contre le schéma
    const result = schema.safeParse(source === "query" ? req.query : req.body);

    if (!result.success) {
      // Formater les erreurs Zod pour renvoyer un message lisible par le client
      res.status(422).json({
        message: "Données invalides",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),   // Chemin du champ en erreur (ex: "email")
          message: issue.message,        // Message d'erreur Zod
        })),
      });
      return;
    }

    // Remplacer la source par les données validées et typées par Zod
    if (source === "query") {
      req.query = result.data as any;
    } else {
      req.body = result.data;
    }
    next();
  };
}
