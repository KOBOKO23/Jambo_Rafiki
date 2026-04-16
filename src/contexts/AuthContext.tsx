import { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiError, type AdminUserProfile } from '@/services/api';

type AuthContextType = {
  user: AdminUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isForbidden: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    async function initAuth() {
      try {
        // Bootstrap CSRF token for session auth
        await api.auth.csrf();
      } catch (err) {
        console.warn('Failed to bootstrap CSRF:', err);
        // Continue anyway - CSRF failure is not blocking
      }

      try {
        const currentUser = await api.auth.currentUser<AdminUserProfile>();
        if (currentUser && currentUser.is_staff) {
          setUser(currentUser);
          setIsForbidden(false);
          setError(null);
        } else {
          setUser(null);
          setIsForbidden(false);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          setIsForbidden(true);
        } else {
          // User not authenticated, which is expected on initial load
          setIsForbidden(false);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void initAuth();
  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);
    setIsForbidden(false);
    try {
      const response = await api.auth.login(email, password);
      if (response.user && response.user.is_staff) {
        setUser(response.user);
        setError(null);
        setIsForbidden(false);
        return true;
      } else {
        setError('You do not have staff access. Please contact your administrator.');
        setUser(null);
        setIsForbidden(true);
        return false;
      }
    } catch (err) {
      let message = 'Login failed. ';
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          message += 'Invalid email or password.';
          setIsForbidden(false);
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          message += 'Your account does not have admin access.';
          setIsForbidden(true);
        } else if (err.message.includes('Connection refused') || err.message.includes('fetch')) {
          message += 'Cannot connect to backend. Is the server running at localhost:8000?';
          setIsForbidden(false);
        } else {
          message += err.message;
          setIsForbidden(false);
        }
      } else {
        message += 'Please check your credentials and try again.';
        setIsForbidden(false);
      }
      setError(message);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    setError(null);
    try {
      await api.auth.logout();
      setUser(null);
      setError(null);
      setIsForbidden(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isForbidden,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
