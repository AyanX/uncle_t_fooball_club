import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import router from '@/router/index';
import { HelmetProvider } from 'react-helmet-async';

const App: React.FC = () => (
  <HelmetProvider>
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider></HelmetProvider>
);

export default App;
