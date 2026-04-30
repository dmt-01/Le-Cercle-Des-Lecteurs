/**
 * Interfaces TypeScript partagées dans l'application.
 * Ces types représentent la structure des données telles qu'elles sont
 * retournées par la base de données (avant d'être encapsulées dans un modèle).
 */

import { Prisma } from "@prisma/client";

/**
 * Type exact des données renvoyées par le repository pour un livre enrichi.
 * Reflète les includes définis dans bookIncludes + les champs calculés par le repository.
 * Les propriétés optionnelles (averageRating, reviewCount) sont ajoutées par le repository.
 */
export type BookRow = Prisma.BookGetPayload<{
  include: {
    authors: { include: { author: true } };
    categorisations: { include: { genre: true } };
    thematisations: { include: { tag: true } };
    _count: { select: { reviews: true } };
  };
}> & {
  averageRating?: number | null;
  reviewCount?: number;
};

/**
 * Type exact des données renvoyées par le repository pour une review.
 * Pas d'includes nécessaires — fromRow n'accède qu'aux champs scalaires.
 * Les rows avec includes supplémentaires (ex: user) sont acceptés par le typage structurel.
 */
export type ReviewRow = Prisma.ReviewGetPayload<Record<string, never>>;