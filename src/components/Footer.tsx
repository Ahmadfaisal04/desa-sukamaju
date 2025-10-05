import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

interface KontakData {
  id_kontak: string;
  email: string;
  telepon: string;
  facebook: string;
  youtube: string;
  instagram: string;
}

const Footer = () => {
  const [kontakData, setKontakData] = useState<KontakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKontakData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/kontak/b094eab0-a132-11f0-b34c-482ae3455d6d`
        );
        const result = await response.json();

        if (result.code === 200 && result.data) {
          setKontakData(result.data);
        }
      } catch (error) {
        console.error("Error fetching kontak data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKontakData();
  }, []);
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}{" "}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.png"
                  alt="Logo Desa Sukamaju"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-xl">Desa Sukamaju</h3>
                {/* <p className="text-gray-400 text-sm">Maju Bersama</p> */}
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Dengan semangat kebersamaan, Desa Sukamaju terus membangun menuju
              masyarakat yang mandiri, sejahtera, dan berdaya saing.
            </p>
            <div className="flex space-x-4">
              {kontakData?.facebook && (
                <a
                  href={kontakData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {kontakData?.instagram && (
                <a
                  href={kontakData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {kontakData?.youtube && (
                <a
                  href={kontakData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {!kontakData?.facebook &&
                !kontakData?.instagram &&
                !kontakData?.youtube &&
                !loading && (
                  <>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  </>
                )}
            </div>
          </div>{" "}
          {/* Quick Links */}{" "}
          <div>
            <h4 className="font-semibold text-lg mb-4">Menu Utama</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  Berita
                </Link>
              </li>
              <li>
                <Link
                  href="/struktur-organisasi"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link
                  href="/galeri"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  Galeri
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  Tentang Desa
                </Link>
              </li>
            </ul>
          </div>{" "}
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Jl. Raya Desa No. 123
                  <br />
                  Kecamatan Sukamaju
                  <br />
                  Kabupaten Makmur 12345
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  {loading
                    ? "Loading..."
                    : kontakData?.telepon || "(021) 1234-5678"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  {loading
                    ? "Loading..."
                    : kontakData?.email || "info@desaSukamaju.id"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Desa Suka Maju • Created with{" "}
            <span className="text-red-500">❤️</span> by pusatweb
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
