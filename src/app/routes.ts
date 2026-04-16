import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedAdminPage } from './components/ProtectedAdminPage';
import { Home } from './pages/Home';
import { FAQ } from './pages/FAQ';
import { Comunicados } from './pages/Comunicados';
import { Login } from './pages/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'faq', Component: FAQ },
      { path: 'comunicados', Component: Comunicados },
      
      { path: 'login', Component: Login },
      { path: 'admin', Component: ProtectedAdminPage },
    ],
  },
]);
