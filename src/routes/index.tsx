import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import RouteErrorPage from '@/components/common/RouteErrorPage';
import { lazy, Suspense } from 'react';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { isRouteEnabled } from '@/config/env';

// Lazy-loaded page components
const DashboardPage = lazy(() => import('@/routes/pages/DashboardPage'));
const QuranPage = lazy(() => import('@/routes/pages/QuranPage'));
const AICompanionPage = lazy(() => import('@/routes/pages/AICompanionPage'));
const MasjidFinderPage = lazy(() => import('@/routes/pages/MasjidFinderPage'));
const QiblaPage = lazy(() => import('@/routes/pages/QiblaPage'));
const TasbihPage = lazy(() => import('@/routes/pages/TasbihPage'));
const CalendarPage = lazy(() => import('@/routes/pages/CalendarPage'));
const BookmarksPage = lazy(() => import('@/routes/pages/BookmarksPage'));
const SettingsPage = lazy(() => import('@/routes/pages/SettingsPage'));
const HadithPage = lazy(() => import('@/routes/pages/HadithPage'));
const NotFoundPage = lazy(() => import('@/routes/pages/NotFoundPage'));

// Loading wrapper
const PageLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="p-8"><LoadingSkeleton count={3} /></div>}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: <PageLoader><DashboardPage /></PageLoader>,
      },
      {
        path: 'quran',
        element: <PageLoader><QuranPage /></PageLoader>,
      },
      {
        path: 'quran/:surahNumber',
        element: <PageLoader><QuranPage /></PageLoader>,
      },
      {
        path: 'ai',
        element: isRouteEnabled('/ai') ? <PageLoader><AICompanionPage /></PageLoader> : <Navigate to="/dashboard" replace />,
      },
      {
        path: 'masjids',
        element: isRouteEnabled('/masjids') ? <PageLoader><MasjidFinderPage /></PageLoader> : <Navigate to="/dashboard" replace />,
      },
      {
        path: 'qibla',
        element: <PageLoader><QiblaPage /></PageLoader>,
      },
      {
        path: 'tasbih',
        element: <PageLoader><TasbihPage /></PageLoader>,
      },
      {
        path: 'calendar',
        element: isRouteEnabled('/calendar') ? <PageLoader><CalendarPage /></PageLoader> : <Navigate to="/dashboard" replace />,
      },
      {
        path: 'bookmarks',
        element: <PageLoader><BookmarksPage /></PageLoader>,
      },
      {
        path: 'settings',
        element: <PageLoader><SettingsPage /></PageLoader>,
      },
      {
        path: 'hadith',
        element: isRouteEnabled('/hadith') ? <PageLoader><HadithPage /></PageLoader> : <Navigate to="/dashboard" replace />,
      },
    ],
  },
  { path: '*', element: <PageLoader><NotFoundPage /></PageLoader> },
]);