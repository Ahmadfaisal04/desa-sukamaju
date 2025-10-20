"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Tag, Search, ChevronRight } from "lucide-react";

interface BeritaData {
  id_berita: string;
  judul_berita: string;
  kategori: string;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  gambar_berita: string[];
  created_at: string;
}

export default function BeritaPage() {
  const [beritaData, setBeritaData] = useState<BeritaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  const categories = ["Semua", "Pembangunan", "Budaya", "Kesehatan", "Ekonomi", "Pendidikan"];

  // Fetch data from API
  useEffect(() => {
    fetchBeritaData();
  }, []);

  const fetchBeritaData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita`);
      const result = await response.json();

      if (result.code === 200) {
        setBeritaData(result.data || []);
        setError(null);
      } else {
        setError(result.message || "Gagal mengambil data berita");
      }
    } catch (error) {
      console.error("Error fetching berita data:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Filter berita berdasarkan search dan kategori
  const filteredBerita = beritaData.filter((berita) => {
    const matchesSearch = berita.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         berita.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || berita.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from data
  const getCategories = () => {
    const apiCategories = new Set(beritaData.map(berita => berita.kategori));
    return ["Semua", ...Array.from(apiCategories)];
  };

  const availableCategories = getCategories();

  return (
    <div className="bg-gray-50 min-h-screen">      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 
              className="text-4xl lg:text-6xl font-bold mb-6"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              Berita Desa
            </h1>
            <p 
              className="text-xl lg:text-2xl text-emerald-100 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="1000"
            >
              Dapatkan informasi terkini seputar kegiatan dan perkembangan di Desa Sejahtera
            </p>
          </div>
        </div>
      </section>      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div 
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            {/* Search */}
            <div 
              className="relative flex-1 max-w-md"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            </div>            {/* Category Filter */}
            <div 
              className="flex flex-wrap gap-2"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              {availableCategories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-all duration-200 hover-lift ${
                    category === selectedCategory
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                  data-aos="zoom-in"
                  data-aos-delay={500 + (index * 50)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>      {/* Featured News */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-gray-800 mb-8"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            Berita Utama
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchBeritaData}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredBerita.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Featured News */}
            <div 
              className="lg:col-span-2"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
                <div className="aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 relative overflow-hidden">
                  {filteredBerita[0].gambar_berita && filteredBerita[0].gambar_berita.length > 0 ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${filteredBerita[0].gambar_berita[0]}`}
                      alt={filteredBerita[0].judul_berita}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 bg-emerald-600/20 flex items-center justify-center ${filteredBerita[0].gambar_berita?.length > 0 ? 'hidden' : ''}`}>
                    <span className="text-emerald-700 font-semibold text-lg">Foto Berita Utama</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(filteredBerita[0].tanggal_pelaksanaan).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                        {filteredBerita[0].kategori}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 hover:text-emerald-600 transition-colors duration-300">
                    {filteredBerita[0].judul_berita}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {filteredBerita[0].deskripsi.substring(0, 200)}...
                  </p>
                  <Link 
                    href={`/berita/${filteredBerita[0].id_berita}`}
                    className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300 group"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>            {/* Side Featured News */}
            <div 
              className="space-y-6"
              data-aos="fade-left"
              data-aos-delay="400"
              data-aos-duration="800"
            >
              {filteredBerita.slice(1, 3).map((berita, index) => (
                <div 
                  key={berita.id_berita} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-delay={600 + (index * 200)}
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-200 to-purple-200 relative overflow-hidden">
                    {berita.gambar_berita && berita.gambar_berita.length > 0 ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${berita.gambar_berita[0]}`}
                        alt={berita.judul_berita}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 bg-blue-600/20 flex items-center justify-center ${berita.gambar_berita?.length > 0 ? 'hidden' : ''}`}>
                      <span className="text-blue-700 font-semibold">Foto Berita</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(berita.tanggal_pelaksanaan).toLocaleDateString('id-ID')}</span>
                      <span>•</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {berita.kategori}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                      {berita.judul_berita}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {berita.deskripsi}
                    </p>
                    <Link 
                      href={`/berita/${berita.id_berita}`}
                      className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm group"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Tidak ada berita yang ditemukan</p>
            </div>
          )}
        </div>
      </section>      {/* All News */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-gray-800 mb-8"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            Semua Berita
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBerita.map((berita, index) => (
              <div 
                key={berita.id_berita} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-100"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="600"
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 relative overflow-hidden">
                  {berita.gambar_berita && berita.gambar_berita.length > 0 ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${berita.gambar_berita[0]}`}
                      alt={berita.judul_berita}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 bg-emerald-600/20 flex items-center justify-center ${berita.gambar_berita?.length > 0 ? 'hidden' : ''}`}>
                    <span className="text-emerald-700 font-semibold">Foto Berita</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(berita.tanggal_pelaksanaan).toLocaleDateString('id-ID')}</span>
                    <span>•</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      {berita.kategori}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                    {berita.judul_berita}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {berita.deskripsi}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(berita.tanggal_pelaksanaan).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/berita/${berita.id_berita}`}
                      className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm group"
                    >
                      <span>Baca</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>          {/* Pagination */}
          <div 
            className="flex justify-center mt-12"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50">
                Sebelumnya
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}