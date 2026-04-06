import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Início' },
    { path: '/faq', label: 'FAQ' },
    { path: '/comunicados', label: 'Comunicados' },
    { path: '/chatbot', label: 'Chatbot' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gray-900">Instituição Educacional</div>
              <div className="text-xs text-gray-600">Central de Ajuda</div>
            </div>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button asChild variant={isAuthenticated ? 'default' : 'outline'}>
                <Link to={isAuthenticated ? '/admin' : '/login'}>
                  {isAuthenticated ? 'Painel Admin' : 'Entrar'}
                </Link>
              </Button>
              {isAuthenticated ? (
                <Button variant="ghost" onClick={logout}>
                  Sair
                </Button>
              ) : null}
            </div>
          </div>

          <button
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
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-4 py-3 transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 px-4">
              <Button asChild variant={isAuthenticated ? 'default' : 'outline'}>
                <Link
                  to={isAuthenticated ? '/admin' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAuthenticated ? 'Painel Admin' : 'Entrar'}
                </Link>
              </Button>
              {isAuthenticated ? (
                <Button
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
