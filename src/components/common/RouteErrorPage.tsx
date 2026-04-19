import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function RouteErrorPage() {
  const error = useRouteError();
  let errorMessage = 'An unexpected error occurred.';
  let status = 'Error';

  if (isRouteErrorResponse(error)) {
    status = error.status.toString();
    errorMessage = error.statusText || 'Page not found.';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-lapis-900 text-parchment-100">
      <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-error" />
      </div>
      <h1 className="text-4xl font-heading font-bold text-gold-400 mb-2">{status}</h1>
      <p className="text-slate-400 text-lg mb-6 text-center max-w-md">{errorMessage}</p>
      <a
        href="/"
        className="px-6 py-3 bg-gold-500 text-lapis-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
      >
        Return to Dashboard
      </a>
    </div>
  );
}
