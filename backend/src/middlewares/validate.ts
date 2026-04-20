import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Middleware générique de validation du corps de requête avec Zod.
 *
 * Utilisation : passer le schéma Zod correspondant à la route.
 * Si les données sont invalides → réponse 422 avec le détail des erreurs.
 * Si les données sont valides  → req.body est remplacé par les données parsées et nettoyées,
 *                                puis la requête continue vers le contrôleur.
 *
 * @param schema - Schéma Zod à utiliser pour valider req.body
 */
export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {

    // Tenter de valider req.body contre le schéma
    const result = schema.safeParse(req.body);

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

    // Remplacer req.body par les données validées et typées par Zod
    req.body = result.data;
    next();
  };
}
