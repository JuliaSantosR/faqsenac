import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const AUTH_STORAGE_KEY = 'school-help-center-auth';

const authMockConfig = {
  login: import.meta.env.VITE_ADMIN_LOGIN?.trim().toLowerCase() ?? '',
  alternateLogin: import.meta.env.VITE_ADMIN_ALT_LOGIN?.trim().toLowerCase() ?? '',
  password: import.meta.env.VITE_ADMIN_PASSWORD ?? '',
  name: import.meta.env.VITE_ADMIN_NAME ?? 'Administrador',
};

interface AuthUser {
  login: string;
  name: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (loginValue: string, password: string) => LoginResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  let rawValue: string | null = null;
  try {
    rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthUser;
  } catch {
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // noop: storage pode estar indisponivel
    }
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (user) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return;
      }

      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // noop: storage indisponivel nao deve quebrar o app
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) {
        setUser(readStoredUser());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login: (loginValue, password) => {
        if (!authMockConfig.login || !authMockConfig.password) {
          return {
            success: false,
            error:
              'Login de demonstracao desabilitado. Configure VITE_ADMIN_LOGIN e VITE_ADMIN_PASSWORD.',
          };
        }

        const normalizedLogin = loginValue.trim().toLowerCase();
        const isValidLogin =
          normalizedLogin === authMockConfig.login ||
          (authMockConfig.alternateLogin && normalizedLogin === authMockConfig.alternateLogin);

        if (!isValidLogin || password !== authMockConfig.password) {
          return {
            success: false,
            error: 'Credenciais inválidas. Verifique o login e a senha informados.',
          };
        }

        setUser({
          login: authMockConfig.login,
          name: authMockConfig.name,
        });

        return { success: true };
      },
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
