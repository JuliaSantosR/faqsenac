import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest } from '../services/api';

const AUTH_STORAGE_KEY = 'unifaq-auth';

interface AuthUser {
  id: string;
  email: string;
  login: string;
  name: string;
  role: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (loginValue: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface StoredAuthState {
  token: string;
  user: AuthUser;
}

function readStoredAuthState(): StoredAuthState | null {
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
    const parsed = JSON.parse(rawValue) as Partial<StoredAuthState>;
    if (
      !parsed ||
      typeof parsed.token !== 'string' ||
      !parsed.user ||
      typeof parsed.user.login !== 'string'
    ) {
      return null;
    }
    return parsed as StoredAuthState;
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
  const [authState, setAuthState] = useState<StoredAuthState | null>(() => readStoredAuthState());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (authState) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
        return;
      }

      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // noop: storage indisponivel nao deve quebrar o app
    }
  }, [authState]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) {
        setAuthState(readStoredAuthState());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(authState?.token),
      user: authState?.user ?? null,
      token: authState?.token ?? null,
      login: async (loginValue, password) => {
        const normalizedLogin = loginValue.trim().toLowerCase();
        if (!normalizedLogin || !password) {
          return { success: false, error: 'Informe e-mail e senha.' };
        }

        try {
          const loginResponse = await apiRequest<{ access_token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: normalizedLogin, password }),
          });

          const profile = await apiRequest<{
            id: string;
            email: string;
            role: string;
          }>('/users/me', {
            token: loginResponse.access_token,
          });

          const nextState: StoredAuthState = {
            token: loginResponse.access_token,
            user: {
              id: profile.id,
              email: profile.email,
              login: profile.email,
              name: profile.email,
              role: profile.role,
            },
          };
          setAuthState(nextState);

          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Não foi possível autenticar.';
          return { success: false, error: message };
        }
      },
      logout: () => setAuthState(null),
    }),
    [authState],
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
