import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const AUTH_STORAGE_KEY = 'unifaq-auth';

const LOCAL_ADMIN = {
  email: 'admin@senac.local',
  password: 'admin123',
  id: 'local-admin',
  role: 'ADMIN',
} as const;

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
      // noop: storage pode estar indisponível
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
      // noop: storage indisponível não deve quebrar o app
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

        if (normalizedLogin !== LOCAL_ADMIN.email || password !== LOCAL_ADMIN.password) {
          return { success: false, error: 'E-mail ou senha inválidos.' };
        }

        setAuthState({
          token: 'local',
          user: {
            id: LOCAL_ADMIN.id,
            email: LOCAL_ADMIN.email,
            login: LOCAL_ADMIN.email,
            name: 'Administrador',
            role: LOCAL_ADMIN.role,
          },
        });

        return { success: true };
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
