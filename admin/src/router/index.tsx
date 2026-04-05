// router/index.tsx — Admin router with auth guards, error boundaries, 404 handling
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import ErrorPage from '@/pages/ErrorPage/index';
import NotFound from '@/pages/NotFound/index';

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

const Spinner = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
    <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid rgba(200,16,46,0.18)', borderTopColor:'#C8102E', animation:'spin 0.7s linear infinite' }}/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<Spinner/>}>{children}</Suspense>
);

const AuthGuard: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner/>;
  if (!user) return <Navigate to="/login" replace/>;
  return <Outlet/>;
};

const GuestGuard: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner/>;
  if (user) return <Navigate to="/" replace/>;
  return <Outlet/>;
};

const router = createBrowserRouter([
  // Public
  {
    element: <GuestGuard/>,
    errorElement: <ErrorPage/>,
    children: [
      { path: '/login', element: <Page><Login/></Page> },
    ],
  },
  // Protected — all admin pages inside AdminLayout
  {
    element: <AuthGuard/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        element: <AdminLayout/>,
        errorElement: <ErrorPage/>,
        children: [
          { path: '/',              element: <Page><Dashboard/></Page>  },
          { path: '/news',          element: <Page><News/></Page>        },
          { path: '/news/:title',   element: <Page><NewsEdit/></Page>    },
          { path: '/team',          element: <Page><Team/></Page>        },
          { path: '/fixtures',      element: <Page><Fixtures/></Page>    },
          { path: '/gallery',       element: <Page><Gallery/></Page>     },
          { path: '/programs',      element: <Page><Programs/></Page>    },
          { path: '/partners',      element: <Page><Partners/></Page>    },
          { path: '/settings',      element: <Page><Settings/></Page>    },
          // Catch-all inside admin — show 404
          { path: '*',             element: <NotFound/>                  },
        ],
      },
    ],
  },
  // Unauthenticated catch-all → redirect to login
  { path: '*', element: <Navigate to="/login" replace/> },
]);

export default router;
