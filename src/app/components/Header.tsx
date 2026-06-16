import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { INSTITUTION_NAME, SITE_NAME } from '../constants/site';
import { useAuth } from '../context/AuthContext';

type NavItem = { label: string; to: string; isActive: boolean };

function getNavItems(pathname: string): NavItem[] {
  if (pathname === '/') {
    return [
      { label: 'Categorias', to: '/#categorias', isActive: false },
      { label: 'Comunicados', to: '/comunicados', isActive: false },
      { label: 'Contato', to: '/#contato', isActive: false },
    ];
  }

  return [
    {
      label: 'Perguntas Frequentes',
      to: '/faq',
      isActive: pathname === '/faq',
    },
    {
      label: 'Comunicados',
      to: '/comunicados',
      isActive: pathname === '/comunicados',
    },
    { label: 'Contato', to: '/#contato', isActive: false },
  ];
}

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navItems = getNavItems(location.pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <span className="rounded-lg bg-[#004581] px-3 py-1.5 text-sm font-bold text-white">
              {SITE_NAME}
            </span>
            <span className="hidden h-5 w-px bg-gray-200 sm:block" aria-hidden="true" />
            <span className="hidden text-sm text-gray-500 sm:block">{INSTITUTION_NAME}</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`text-sm transition-colors ${
                    item.isActive
                      ? 'font-bold text-[#004581] underline decoration-[#004581] decoration-2 underline-offset-4'
                      : 'text-gray-600 hover:text-[#004581]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              to={isAuthenticated ? '/admin' : '/login'}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              {isAuthenticated ? 'Admin' : 'Entrar'}
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Sair
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen ? (
          <nav className="border-t py-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm ${
                  item.isActive
                    ? 'font-bold text-[#004581]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-4 border-t px-4 pt-4">
              <Link
                to={isAuthenticated ? '/admin' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-gray-500"
              >
                {isAuthenticated ? 'Admin' : 'Entrar'}
              </Link>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm text-gray-500"
                >
                  Sair
                </button>
              ) : null}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
