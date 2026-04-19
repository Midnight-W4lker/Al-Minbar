import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h1 className="text-8xl font-heading font-bold text-gold-500">404</h1>
      <p className="text-xl text-slate-400 mt-4">Page not found</p>
      <Link to="/dashboard" className="mt-6 px-6 py-3 bg-gold-500 text-lapis-900 rounded-xl font-bold hover:bg-gold-400 transition-colors">
        Go Home
      </Link>
    </div>
  );
}