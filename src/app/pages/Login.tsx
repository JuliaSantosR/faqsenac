import React, { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: string;
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState('');

  const redirectPath = (location.state as LocationState | null)?.from ?? '/admin';

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = login(formData.login, formData.password);

    if (!result.success) {
      setError(result.error ?? 'Não foi possível autenticar.');
      return;
    }

    setError('');
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <section className="bg-brand-primary px-4 pt-12 pb-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase">
            <ShieldCheck className="h-4 w-4" />
            Acesso administrativo
          </div>
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">Login do administrador</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-blue-100">
            Área restrita para atualização de conteúdos oficiais do UniFAQ. As páginas públicas
            continuam disponíveis sem autenticação.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-md px-4 pb-16 sm:px-6 lg:px-8">
        <div className="-mt-16 rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="bg-brand-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Entrar no painel</h2>
              <p className="text-sm text-gray-500">
                Use suas credenciais para acessar a área de edição.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">E-mail ou login</Label>
              <Input
                id="login"
                type="text"
                value={formData.login}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, login: event.target.value }))
                }
                placeholder="admin@instituicao.local"
                autoComplete="username"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="Digite a senha"
                autoComplete="current-password"
                required
                className="h-11"
              />
            </div>

            {error ? (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-brand-accent text-sm font-semibold text-white hover:bg-brand-accent-hover"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600">
            <p className="mb-1 font-medium text-gray-900">Ambiente de demonstração</p>
            <p>
              Configure as variáveis <code>VITE_ADMIN_LOGIN</code> e{' '}
              <code>VITE_ADMIN_PASSWORD</code> no ambiente local para habilitar o login mock.
            </p>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-sm text-[#004581] transition-colors hover:text-[#003666]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
        </div>
      </section>
    </div>
  );
}
