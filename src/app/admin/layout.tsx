"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, X, Home, Newspaper, Camera, Users, Settings, 
  LogOut, BarChart3, FileText, Calendar 
} from "lucide-react";

const adminMenuItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/berita", label: "Kelola Berita", icon: Newspaper },
  { href: "/admin/galeri", label: "Kelola Galeri", icon: Camera },
  { href: "/admin/organisasi", label: "Kelola Organisasi", icon: Users },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-emerald-600" />
                <span className="group-hover:text-emerald-600">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            >
              <Home className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600" />
              <span className="group-hover:text-blue-600">Kembali ke Website</span>
            </Link>
            <button className="w-full flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-red-50 transition-colors duration-200 group">
              <LogOut className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-600" />
              <span className="group-hover:text-red-600">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-2xl font-bold text-gray-800 ml-4 lg:ml-0">Dashboard Admin</h2>
              
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <span className="text-gray-700 font-medium">Administrator</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}