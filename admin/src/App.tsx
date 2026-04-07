
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider }      from '@/context/AuthContext';
import { AdminDataProvider } from '@/context/AdminDataContext';
import { ToastProvider }     from '@/context/ToastContext';
import router from '@/router/index';

const App: React.FC = () => (
  <ToastProvider>
    <AuthProvider>
      <AdminDataProvider>
        <RouterProvider router={router} />
      </AdminDataProvider>
    </AuthProvider>
  </ToastProvider>
);

export default App;
