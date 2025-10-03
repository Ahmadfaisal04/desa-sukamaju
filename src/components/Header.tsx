"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Mencegah scroll body ketika menu terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup saat komponen unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);
  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/berita", label: "Berita" },
    { href: "/struktur-organisasi", label: "Struktur Organisasi" },
    { href: "/galeri", label: "Galeri" },
    { href: "/tentang", label: "Tentang Desa" },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {" "}
        <div className="flex items-center justify-between h-16">
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
              {/* <p className="text-emerald-100 text-xs">Maju Bersama</p> */}{" "}
            </div>
          </Link>
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
            ))}
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
          </button>{" "}
        </div>
      </div>{" "}
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-emerald-700 shadow-lg md:hidden">
          <nav className="py-4 space-y-2">
            {" "}
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-6 py-3 text-white hover:bg-emerald-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
