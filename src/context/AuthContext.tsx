import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'merchant' | 'staff';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // Merchant-specific fields
  businessName?: string;
  businessCategory?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for different roles
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@themepark.com': {
    password: 'admin123',
    user: {
      id: 'admin-1',
      email: 'admin@themepark.com',
      name: 'Park Admin',
      role: 'admin',
    },
  },
  'merchant@themepark.com': {
    password: 'merchant123',
    user: {
      id: 'merchant-1',
      email: 'merchant@themepark.com',
      name: 'John Smith',
      role: 'merchant',
      businessName: 'Thunder Snacks',
      businessCategory: 'Food & Beverage',
      location: 'Adventure Zone - Stall A12',
    },
  },
  'staff@themepark.com': {
    password: 'staff123',
    user: {
      id: 'staff-1',
      email: 'staff@themepark.com',
      name: 'Sarah Johnson',
      role: 'staff',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem('portal_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('portal_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const demoUser = DEMO_USERS[email];
    if (demoUser && password === demoUser.password) {
      setUser(demoUser.user);
      localStorage.setItem('portal_user', JSON.stringify(demoUser.user));
      return;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portal_user');
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
