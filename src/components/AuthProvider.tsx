"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing authentication
    const checkAuth = () => {
      // Make sure we're on the client side
      if (typeof window !== 'undefined') {
        const authToken = localStorage.getItem("adminAuth");
        const apiToken = localStorage.getItem("adminToken");
        
        // User is authenticated if both tokens exist
        const isAuth = authToken === "true" && !!apiToken;
        setIsAuthenticated(isAuth);
        
        console.log('Auth check:', { authToken, apiToken: !!apiToken, isAuth });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isLoginPage = pathname === "/admin/login";
      const isAdminRoute = pathname.startsWith("/admin");

      console.log('Redirect logic:', { 
        pathname, 
        isAuthenticated, 
        isLoginPage, 
        isAdminRoute,
        isLoading 
      });

      if (isAdminRoute && !isAuthenticated && !isLoginPage) {
        console.log('Redirecting to login - not authenticated');
        router.push("/admin/login");
      } else if (isLoginPage && isAuthenticated) {
        console.log('Redirecting to admin - already authenticated');
        router.push("/admin");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = (token?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("adminAuth", "true");
      if (token) {
        localStorage.setItem("adminToken", token);
      }
    }
    setIsAuthenticated(true);
    console.log('Login successful, isAuthenticated set to true');
  };
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminToken");
    }
    setIsAuthenticated(false);
    console.log('Logout successful, isAuthenticated set to false');
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
