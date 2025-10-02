import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">Desa Sukamaju</h3>
                <p className="text-gray-400 text-sm">Maju Bersama</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Desa Sukamaju adalah desa yang berkomitmen untuk memberikan pelayanan terbaik kepada masyarakat 
              dan membangun desa yang maju, mandiri, dan Sejahtera bagi semua warga.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Menu Utama</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Tentang Desa
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/struktur-organisasi" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  Galeri
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Jl. Raya Desa No. 123<br />
                  Kecamatan Sukamaju<br />
                  Kabupaten Makmur 12345
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">(021) 1234-5678</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">info@desaSukamaju.id</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Desa Sukamaju. Semua hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;