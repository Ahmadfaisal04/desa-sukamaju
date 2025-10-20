"use client";

import {
  Users,
  Newspaper,
  Camera,
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Interface untuk data berita dari API
interface BeritaData {
  id_berita: string;
  judul_berita: string;
  kategori: string;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  gambar_berita: string[];
  created_at: string;
}

// Interface untuk data aparat dari API
interface AparatData {
  id_aparat: string;
  nama: string;
  jabatan: string;
  no_telepon: string;
  email: string;
  status: string;
  periode_mulai: string;
  periode_selesai: string;
  foto: string;
}

export default function AdminDashboard() {
  const [recentNews, setRecentNews] = useState<BeritaData[]>([]);
  const [recentGallery, setRecentGallery] = useState<any[]>([]);
  const [aparatData, setAparatData] = useState<AparatData[]>([]);
  const [totalBerita, setTotalBerita] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data dari API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data berita
        const beritaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita`);
        if (!beritaResponse.ok) throw new Error('Gagal mengambil data berita');
        
        const beritaResult = await beritaResponse.json();
        
        if (beritaResult.code === 200) {
          const beritaData = beritaResult.data || [];
          setTotalBerita(beritaData.length);
          
          // Ambil 3 berita terbaru (urutkan berdasarkan created_at terbaru)
          const sortedNews = beritaData
            .sort((a: BeritaData, b: BeritaData) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 3);
          
          setRecentNews(sortedNews);

          // Ambil gambar untuk galeri dari semua berita
          const galleryItems: any[] = [];
          beritaData.forEach((berita: BeritaData) => {
            if (berita.gambar_berita && berita.gambar_berita.length > 0) {
              berita.gambar_berita.forEach((gambar, index) => {
                galleryItems.push({
                  id: `${berita.id_berita}_${index}`,
                  src: gambar,
                  title: berita.judul_berita,
                  category: berita.kategori,
                  date: berita.tanggal_pelaksanaan,
                  berita_id: berita.id_berita
                });
              });
            }
          });

          // Ambil 4 gambar terbaru untuk galeri
          const sortedGallery = galleryItems
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4);
          
          setRecentGallery(sortedGallery);
        }

        // Fetch data aparat
        const aparatResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aparat`);
        if (!aparatResponse.ok) throw new Error('Gagal mengambil data aparat');
        
        const aparatResult = await aparatResponse.json();
        
        if (aparatResult.code === 200) {
          setAparatData(aparatResult.data || []);
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hitung total gambar dari semua berita
  const totalGambar = recentNews.reduce((total, berita) => {
    return total + (berita.gambar_berita ? berita.gambar_berita.length : 0);
  }, 0);

  // Fungsi untuk mendapatkan URL gambar
  const getImageUrl = (filename: string) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${filename}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Selamat Datang, Administrator!</h1>
              <p className="text-emerald-100 text-lg">
                Kelola konten website Desa Sukamaju dengan mudah dan efisien.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Selamat Datang, Administrator!</h1>
              <p className="text-emerald-100 text-lg">
                Kelola konten website Desa Sukamaju dengan mudah dan efisien.
              </p>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Gagal memuat data</h3>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Selamat Datang, Administrator!
            </h1>
            <p className="text-emerald-100 text-lg">
              Kelola konten website Desa Sukamaju dengan mudah dan efisien.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Berita
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {totalBerita}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Newspaper className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{recentNews.length} minggu ini</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Galeri
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {totalGambar}
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Camera className="w-7 h-7 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{recentGallery.length} minggu ini</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Struktur Organisasi
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {aparatData.length}
              </p>
            </div>
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-gray-600 font-medium">Struktur lengkap</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Pengunjung
              </p>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Eye className="w-7 h-7 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+15% bulan ini</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/berita"
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200 hover:shadow-md hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Kelola Berita</h3>
              <p className="text-sm text-gray-600">Buat dan edit berita desa</p>
            </div>
          </Link>
          <Link
            href="/admin/galeri"
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200 hover:shadow-md hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <Plus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Kelola Galeri</h3>
              <p className="text-sm text-gray-600">Upload dan atur foto</p>
            </div>
          </Link>
          <Link
            href="/admin/organisasi"
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm p-6 border border-emerald-200 hover:shadow-md hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Plus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Kelola Organisasi
              </h3>
              <p className="text-sm text-gray-600">Atur struktur organisasi</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Berita Terbaru
              </h2>
              <Link
                href="/admin/berita"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Lihat Semua
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div key={news.id_berita} className="flex items-start space-x-3 group">
                  <div className="w-16 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {news.gambar_berita && news.gambar_berita.length > 0 ? (
                      <img
                        src={getImageUrl(news.gambar_berita[0])}
                        alt={news.judul_berita}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center ${news.gambar_berita && news.gambar_berita.length > 0 ? 'hidden' : ''}`}>
                      <span className="text-blue-700 text-xs font-semibold">
                        IMG
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {news.judul_berita}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(news.tanggal_pelaksanaan).toLocaleDateString("id-ID")}
                      </span>
                      <span>•</span>
                      <span>{news.kategori}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/admin/berita/edit/${news.id_berita}`}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {recentNews.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Belum ada berita
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Galeri Terbaru
              </h2>
              <Link
                href="/admin/galeri"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Lihat Semua
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {recentGallery.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-square bg-gradient-to-br from-emerald-200 to-teal-200 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(item.src)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center hidden">
                      <span className="text-emerald-700 font-semibold text-sm">
                        Foto
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <Link
                          href={`/admin/berita/edit/${item.berita_id}`}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
              ))}
              {recentGallery.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  Belum ada foto di galeri
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}