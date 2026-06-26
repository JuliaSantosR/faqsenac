import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('./pages/Home')).Home }),
      },
      {
        path: 'faq',
        lazy: async () => ({ Component: (await import('./pages/FAQ')).FAQ }),
      },
      {
        path: 'comunicados',
        lazy: async () => ({ Component: (await import('./pages/Comunicados')).Comunicados }),
      },
      {
        path: 'login',
        lazy: async () => ({ Component: (await import('./pages/Login')).Login }),
      },
      {
        path: 'admin',
        lazy: async () => ({
          Component: (await import('./components/ProtectedAdminPage')).ProtectedAdminPage,
        }),
      },
    ],
  },
]);
