import { Request, Response, NextFunction } from "express";
import { AppError } from "../libs/AppError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  const isDev = process.env.NODE_ENV === "dev";
  const message = isDev && err instanceof Error ? err.message : "Une erreur interne est survenue";

  res.status(500).json({ message });
}
