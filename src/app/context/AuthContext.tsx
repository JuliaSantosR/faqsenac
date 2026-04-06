import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const AUTH_STORAGE_KEY = 'school-help-center-auth';

export const ADMIN_CREDENTIALS = {
  login: 'admin@escola.local',
  alternateLogin: 'admin',
  password: 'admin123',
  name: 'Administrador Escolar',
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

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login: (loginValue, password) => {
        const normalizedLogin = loginValue.trim().toLowerCase();
        const isValidLogin =
          normalizedLogin === ADMIN_CREDENTIALS.login ||
          normalizedLogin === ADMIN_CREDENTIALS.alternateLogin;

        if (!isValidLogin || password !== ADMIN_CREDENTIALS.password) {
          return {
            success: false,
            error: 'Credenciais inválidas. Verifique o login e a senha informados.',
          };
        }

        setUser({
          login: ADMIN_CREDENTIALS.login,
          name: ADMIN_CREDENTIALS.name,
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
