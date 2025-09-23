import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  adminUser: {
    username: string;
    userType: string;
  } | null;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ username: string; userType: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem('propconnect_admin_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setAdminUser(authData);
      } catch (error) {
        localStorage.removeItem('propconnect_admin_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://c707ef986dd3.ngrok-free.app/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.userType === 'ADMIN') {
        const authData = {
          username: data.username,
          userType: data.userType,
        };
        
        setIsAuthenticated(true);
        setAdminUser(authData);
        localStorage.setItem('propconnect_admin_auth', JSON.stringify(authData));
        
        toast({
          title: "Login Successful",
          description: data.message || "Welcome to PropConnect Admin Panel",
          variant: "default",
        });
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid admin credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('propconnect_admin_auth');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      logout,
      adminUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};