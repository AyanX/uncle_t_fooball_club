// router/index.tsx — Admin router with auth guard
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';

// Lazy pages
const Login      = lazy(() => import('@/pages/Login/index'));
const Dashboard  = lazy(() => import('@/pages/Dashboard/index'));
const News       = lazy(() => import('@/pages/News/index'));
const NewsEdit   = lazy(() => import('@/pages/NewsEdit/index'));
const Team       = lazy(() => import('@/pages/Team/index'));
const Fixtures   = lazy(() => import('@/pages/Fixtures/index'));
const Gallery    = lazy(() => import('@/pages/Gallery/index'));
const Programs   = lazy(() => import('@/pages/Programs/index'));
const Partners   = lazy(() => import('@/pages/Partners/index'));
const Settings   = lazy(() => import('@/pages/Settings/index'));

// Spinner fallback
const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(200,16,46,0.2)', borderTopColor: '#C8102E', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const Page = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Spinner />}>{children}</Suspense>
);

// Auth guard — redirects to /login if not authenticated
const AuthGuard: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Redirect logged-in users away from login
const GuestGuard: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
};

const router = createBrowserRouter([
  // Public routes
  {
    element: <GuestGuard />,
    children: [
      { path: '/login', element: <Page><Login /></Page> },
    ],
  },
  // Protected admin routes
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/',            element: <Page><Dashboard /></Page> },
          { path: '/news',        element: <Page><News /></Page> },
          { path: '/news/:id',    element: <Page><NewsEdit /></Page> },
          { path: '/team',        element: <Page><Team /></Page> },
          { path: '/fixtures',    element: <Page><Fixtures /></Page> },
          { path: '/gallery',     element: <Page><Gallery /></Page> },
          { path: '/programs',    element: <Page><Programs /></Page> },
          { path: '/partners',    element: <Page><Partners /></Page> },
          { path: '/settings',    element: <Page><Settings /></Page> },
        ],
      },
    ],
  },
  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
