/** Erreur métier avec code HTTP — lancée par les services pour signaler des erreurs attendues (404, 409, etc.). */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}
