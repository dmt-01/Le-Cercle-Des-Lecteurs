type Props = {
  message?: string;
  onRetry?: () => void;
};

/** Message d'erreur centré avec bouton "Réessayer" optionnel. */
function ErrorMessage({
  message = "Une erreur est survenue.",
  onRetry,
}: Props) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <p className="text-primary/50 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs uppercase tracking-widest text-secondary border border-secondary/30 px-4 py-2 rounded-full hover:bg-secondary/5 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
