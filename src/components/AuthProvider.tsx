"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
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
      const authToken = localStorage.getItem("adminAuth");
      setIsAuthenticated(authToken === "true");
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isLoginPage = pathname === "/admin/login";
      const isAdminRoute = pathname.startsWith("/admin");

      if (isAdminRoute && !isAuthenticated && !isLoginPage) {
        router.push("/admin/login");
      } else if (isLoginPage && isAuthenticated) {
        router.push("/admin");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = () => {
    localStorage.setItem("adminAuth", "true");
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
