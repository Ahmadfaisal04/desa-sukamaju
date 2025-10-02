"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  Newspaper,
  Users,
  Camera,
  Settings,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/berita", label: "Berita", icon: Newspaper },
    { href: "/struktur-organisasi", label: "Struktur Organisasi", icon: Users },
    { href: "/galeri", label: "Galeri", icon: Camera },
    { href: "/tentang", label: "Tentang Desa", icon: Info },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {" "}
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="Logo Desa Sukamaju"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-xl">Desa Sukamaju</h1>
              {/* <p className="text-emerald-100 text-xs">Maju Bersama</p> */}
            </div>
          </Link>{" "}
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-emerald-200 transition-colors duration-200"
              >
                <span>{item.label}</span>
              </Link>
            ))}{" "}
            <Link
              href="/admin"
              className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors duration-200"
            >
              <span>Admin</span>
            </Link>
          </nav>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-emerald-700 rounded-b-lg mb-2">
            <nav className="py-4 space-y-2">
              {" "}
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-white hover:bg-emerald-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              ))}{" "}
              <Link
                href="/admin"
                className="block px-4 py-2 text-emerald-600 bg-white mx-4 rounded-lg hover:bg-emerald-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Admin</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
