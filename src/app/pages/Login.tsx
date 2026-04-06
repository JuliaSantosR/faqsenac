import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ADMIN_CREDENTIALS, useAuth } from '../context/AuthContext';

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
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    <div className="min-h-screen bg-slate-100 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            Acesso administrativo protegido
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl text-slate-900">Login do administrador</h1>
            <p className="max-w-xl text-lg text-slate-600">
              Este acesso existe apenas para o responsável pela atualização de conteúdos oficiais da
              escola. As páginas públicas continuam disponíveis sem autenticação.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg text-slate-900">Ambiente de demonstração</h2>
            <p className="text-sm text-slate-600">
              Login: <strong>{ADMIN_CREDENTIALS.login}</strong> ou <strong>admin</strong>
            </p>
            <p className="text-sm text-slate-600">
              Senha: <strong>{ADMIN_CREDENTIALS.password}</strong>
            </p>
          </div>
        </section>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <CardTitle>Entrar no painel</CardTitle>
            <CardDescription>
              Informe o login administrativo configurado para acessar a área de edição.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  placeholder="admin@escola.local"
                  autoComplete="username"
                  required
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
                />
              </div>

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
