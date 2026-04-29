export function getErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) return err.message;

  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as any).message === "string"
  ) {
    return (err as any).message;
  }

  return fallback;
}