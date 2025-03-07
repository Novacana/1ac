
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Simulated authentication - replace with real authentication in production
  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('doctor_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Determine user roles
  const isAuthenticated = user !== null;
  const isDoctor = isAuthenticated && user.role === 'doctor';
  const isAdmin = isAuthenticated && user.role === 'admin';
  
  const login = async (email: string, password: string) => {
    // Simulation - in production, this would be a real API call
    // Demo user for development - in production, validate credentials on server
    if (email === 'doctor@example.com' && password === 'password') {
      const demoUser = {
        id: '1',
        name: 'Dr. Schmidt',
        email: 'doctor@example.com',
        role: 'doctor' as const
      };
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('doctor_user');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isDoctor, 
      isAdmin, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
