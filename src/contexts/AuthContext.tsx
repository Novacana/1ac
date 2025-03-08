
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'admin' | 'user';
  address?: {
    street?: string;
    additionalInfo?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => void;
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
        role: 'doctor' as const,
        address: {
          street: 'Musterstraße 1',
          city: 'Berlin',
          state: 'Berlin',
          zip: '10115',
          country: 'Deutschland'
        },
        phone: '+49 123 456789'
      };
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else if (email === 'user@example.com' && password === 'password') {
      const demoUser = {
        id: '2',
        name: 'Max Mustermann',
        email: 'user@example.com',
        role: 'user' as const,
        address: {
          street: 'Musterstraße 123',
          additionalInfo: 'Wohnung 4B',
          city: 'Berlin',
          state: 'Berlin',
          zip: '10115',
          country: 'Deutschland'
        },
        phone: '+49 987 654321'
      };
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulation - in production, this would be a real API call
    const newUser = {
      id: Math.random().toString(36).substring(2, 9), // Generate random ID
      name,
      email,
      role: 'user' as const
    };
    
    setUser(newUser);
    localStorage.setItem('doctor_user', JSON.stringify(newUser));
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
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
      logout,
      register,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
