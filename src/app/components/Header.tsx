import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { INSTITUTION_NAME, SITE_NAME } from '../constants/site';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

const NAV_ITEMS = [
  { label: 'Perguntas Frequentes', path: '/faq' },
  { label: 'Comunicados', path: '/comunicados' },
  { label: 'Contato', path: '/#contato' },
] as const;

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/#contato') {
      return location.hash === '#contato';
    }

    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90">
            <span className="rounded-lg bg-[#004581] px-3 py-1.5 text-sm font-bold text-white">
              {SITE_NAME}
            </span>
            <span className="hidden h-5 w-px bg-gray-200 sm:block" aria-hidden="true" />
            <span className="hidden text-sm text-gray-500 sm:block">{INSTITUTION_NAME}</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <nav className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-colors ${
                    isActive(item.path)
                      ? 'font-bold text-[#004581] underline decoration-[#004581] decoration-2 underline-offset-4'
                      : 'text-gray-600 hover:text-[#004581]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
              <Button
                asChild
                size="sm"
                variant={isAuthenticated ? 'default' : 'outline'}
                className={
                  isAuthenticated
                    ? 'bg-[#004581] hover:bg-[#003666]'
                    : 'border-[#004581] text-[#004581] hover:bg-blue-50'
                }
              >
                <Link to={isAuthenticated ? '/admin' : '/login'}>
                  {isAuthenticated ? 'Painel Admin' : 'Entrar'}
                </Link>
              </Button>
              {isAuthenticated ? (
                <Button size="sm" variant="ghost" onClick={logout}>
                  Sair
                </Button>
              ) : null}
            </div>
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
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm ${
                  isActive(item.path)
                    ? 'font-bold text-[#004581]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t px-4 pt-4">
              <Button
                asChild
                size="sm"
                variant={isAuthenticated ? 'default' : 'outline'}
                className={
                  isAuthenticated
                    ? 'bg-[#004581] hover:bg-[#003666]'
                    : 'border-[#004581] text-[#004581] hover:bg-blue-50'
                }
              >
                <Link
                  to={isAuthenticated ? '/admin' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAuthenticated ? 'Painel Admin' : 'Entrar'}
                </Link>
              </Button>
              {isAuthenticated ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sair
                </Button>
              ) : null}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
