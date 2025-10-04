"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Menu,
  X,
  Newspaper,
  Camera,
  Users,
  Settings,
  LogOut,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Globe,
  Phone,
  Shield,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/components/AuthProvider";

const adminMenuItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/berita", label: "Kelola Berita", icon: Newspaper },
  { href: "/admin/galeri", label: "Kelola Galeri", icon: Camera },
  { href: "/admin/organisasi", label: "Kelola Organisasi", icon: Users },
];

const settingsMenuItems = [
  { href: "/admin/pengaturan?tab=kontak", label: "Kontak", icon: Phone },
  { href: "/admin/pengaturan?tab=privacy", label: "Privacy", icon: Shield },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current tab from URL params, with fallback
  const currentTab = mounted ? (searchParams.get('tab') || 'kontak') : 'kontak';

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 relative mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="Logo Desa Sukamaju"
              fill
              className="object-contain animate-pulse"
            />
          </div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated and not already on login page
  if (!isAuthenticated && pathname !== "/admin/login") {
    return children;
  }

  // Show login page content if on login page
  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}{" "}
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 relative">
              <Image
                src="/logo.png"
                alt="Logo Desa Sukamaju"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">Desa Sukamaju</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>{" "}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 group ${
                  pathname === item.href ? "bg-emerald-100 text-emerald-700" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 mr-3 ${
                  pathname === item.href ? "text-emerald-600" : "text-gray-500 group-hover:text-emerald-600"
                }`} />
                <span className={`${
                  pathname === item.href ? "text-emerald-700" : "group-hover:text-emerald-600"
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                className={`w-full flex items-center justify-between px-3 py-3 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 group ${
                  pathname.startsWith("/admin/pengaturan") ? "bg-emerald-100 text-emerald-700" : ""
                }`}
              >
                <div className="flex items-center">
                  <Settings className={`w-5 h-5 mr-3 ${
                    pathname.startsWith("/admin/pengaturan") ? "text-emerald-600" : "text-gray-500 group-hover:text-emerald-600"
                  }`} />
                  <span className={`${
                    pathname.startsWith("/admin/pengaturan") ? "text-emerald-700" : "group-hover:text-emerald-600"
                  }`}>
                    Pengaturan
                  </span>
                </div>
                {settingsDropdownOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                )}
              </button>
              
              {settingsDropdownOpen && (
                <div className="mt-1 ml-6 space-y-1">
                  {settingsMenuItems.map((item) => {
                    const tabParam = new URL(item.href, 'http://localhost').searchParams.get('tab');
                    const isActive = mounted && pathname === '/admin/pengaturan' && currentTab === tabParam;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 group ${
                          isActive ? "bg-emerald-50 text-emerald-700" : ""
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className={`w-4 h-4 mr-3 ${
                          isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
                        }`} />
                        <span className={`${
                          isActive ? "text-emerald-700" : "group-hover:text-emerald-600"
                        }`}>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>{" "}
          <div className="mt-8 pt-8 border-t border-gray-200 sticky bottom-0 bg-white">
            {" "}
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200 group"
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-600" />
              <span className="group-hover:text-red-600">Logout</span>
            </button>
          </div>
        </nav>
      </div>{" "}
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-2xl font-bold text-gray-800 ml-4 lg:ml-0">
                Panel Administrasi
              </h2>

              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-lg border border-emerald-100">
                  <div className="w-8 h-8 relative">
                    <Image
                      src="/logo.png"
                      alt="Admin Avatar"
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium text-sm">
                      Administrator
                    </span>
                    <p className="text-emerald-600 text-xs font-medium">
                      Desa Sukamaju
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>{" "}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </Suspense>
    </AuthProvider>
  );
}
