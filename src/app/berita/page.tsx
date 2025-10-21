"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Tag, Search, ChevronRight, ChevronLeft } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 berita per halaman

  const categories = [
    "Semua",
    "Pembangunan",
    "Budaya",
    "Kesehatan",
    "Ekonomi",
    "Pendidikan",
  ];

  // Fetch data from API
  useEffect(() => {
    fetchBeritaData();
  }, []);

  const fetchBeritaData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita`
      );
      const result = await response.json();

      if (result.code === 200) {
        // Sort berita berdasarkan tanggal terbaru
        const sortedData = (result.data || []).sort(
          (a: BeritaData, b: BeritaData) =>
            new Date(b.tanggal_pelaksanaan).getTime() -
            new Date(a.tanggal_pelaksanaan).getTime()
        );
        setBeritaData(sortedData);
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
    const matchesSearch =
      berita.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) ||
      berita.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || berita.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalItems = filteredBerita.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBerita = filteredBerita.slice(startIndex, endIndex);

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Get unique categories from data
  const getCategories = () => {
    const apiCategories = new Set(beritaData.map((berita) => berita.kategori));
    return ["Semua", ...Array.from(apiCategories)];
  };

  const availableCategories = getCategories();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Berita Desa
            </h1>
            <p className="text-base md:text-lg text-emerald-100 leading-relaxed">
              Dapatkan informasi terkini seputar kegiatan dan perkembangan di
              Desa Sejahtera
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-4 md:py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full transition-all duration-200 text-xs md:text-sm ${
                    category === selectedCategory
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
            Berita Terbaru
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-3 text-sm">{error}</p>
              <button
                onClick={fetchBeritaData}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300 text-sm"
              >
                Coba Lagi
              </button>
            </div>
          ) : currentBerita.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Main Latest News */}
              {currentBerita.length > 0 && (
                <div className="lg:col-span-2">
                  <Link
                    href={`/berita/${currentBerita[0].id_berita}`}
                    className="block"
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 cursor-pointer group">
                      <div className="aspect-video bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
                        {currentBerita[0].gambar_berita &&
                        currentBerita[0].gambar_berita.length > 0 ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${currentBerita[0].gambar_berita[0]}`}
                            alt={currentBerita[0].judul_berita}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`absolute inset-0 bg-emerald-600/5 flex items-center justify-center ${
                            currentBerita[0].gambar_berita?.length > 0
                              ? "hidden"
                              : ""
                          }`}
                        >
                          <span className="text-emerald-700 font-medium text-sm">
                            Berita Terbaru
                          </span>
                        </div>
                      </div>
                      <div className="p-4 md:p-6">
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(
                                currentBerita[0].tanggal_pelaksanaan
                              ).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                              {currentBerita[0].kategori}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                          {currentBerita[0].judul_berita}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
                          {currentBerita[0].deskripsi.substring(0, 150)}...
                        </p>
                        <div className="inline-flex items-center space-x-1 text-emerald-600 font-semibold text-sm group-hover:text-emerald-700 transition-colors duration-300">
                          <span>Baca Selengkapnya</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Side Latest News */}
              {currentBerita.length > 1 && (
                <div className="space-y-3 md:space-y-4">
                  {currentBerita.slice(1, 3).map((berita) => (
                    <Link
                      key={berita.id_berita}
                      href={`/berita/${berita.id_berita}`}
                      className="block"
                    >
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200 cursor-pointer group">
                        <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                          {berita.gambar_berita &&
                          berita.gambar_berita.length > 0 ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${berita.gambar_berita[0]}`}
                              alt={berita.judul_berita}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}
                          <div
                            className={`absolute inset-0 bg-blue-600/5 flex items-center justify-center ${
                              berita.gambar_berita?.length > 0 ? "hidden" : ""
                            }`}
                          >
                            <span className="text-blue-700 font-medium text-xs">
                              Berita Terbaru
                            </span>
                          </div>
                        </div>
                        <div className="p-3 md:p-4">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(
                                berita.tanggal_pelaksanaan
                              ).toLocaleDateString("id-ID")}
                            </span>
                            <span>•</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              {berita.kategori}
                            </span>
                          </div>
                          <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                            {berita.judul_berita}
                          </h3>
                          <p className="text-gray-600 mb-2 text-xs line-clamp-2">
                            {berita.deskripsi}
                          </p>
                          <div className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium text-xs group">
                            <span>Baca Selengkapnya</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                          </div>
                        </div>{" "}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-base">
                Tidak ada berita yang ditemukan
              </p>
            </div>
          )}
        </div>
      </section>

      {/* All News */}
      <section className="py-6 md:py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
            Semua Berita
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {currentBerita.map((berita) => (
              <Link
                key={berita.id_berita}
                href={`/berita/${berita.id_berita}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200 cursor-pointer group h-full">
                  <div className="aspect-video bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
                    {berita.gambar_berita && berita.gambar_berita.length > 0 ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${berita.gambar_berita[0]}`}
                        alt={berita.judul_berita}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`absolute inset-0 bg-emerald-600/5 flex items-center justify-center ${
                        berita.gambar_berita?.length > 0 ? "hidden" : ""
                      }`}
                    >
                      <span className="text-emerald-700 font-medium text-xs">
                        Foto Berita
                      </span>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(
                          berita.tanggal_pelaksanaan
                        ).toLocaleDateString("id-ID")}
                      </span>
                      <span>•</span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {berita.kategori}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                      {berita.judul_berita}
                    </h3>
                    <p className="text-gray-600 mb-3 text-xs line-clamp-3">
                      {berita.deskripsi}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(
                              berita.tanggal_pelaksanaan
                            ).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                      <div className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium text-xs group">
                        <span>Baca</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>{" "}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-8 space-y-4">
              {/* Pagination Info */}
              <div className="text-sm text-gray-600">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                dari {totalItems} berita
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors duration-200 ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50 hover:border-emerald-300"
                  }`}
                >
                  Sebelumnya
                </button>

                {getPageNumbers().map((pageNum, index) => (
                  <div key={index}>
                    {pageNum === "..." ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => goToPage(pageNum as number)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          currentPage === pageNum
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors duration-200 ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50 hover:border-emerald-300"
                  }`}
                >
                  Selanjutnya
                </button>
              </div>

              {/* Jump to Page */}
              {totalPages > 5 && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">Loncat ke halaman:</span>
                  <select
                    value={currentPage}
                    onChange={(e) => goToPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <option key={page} value={page}>
                          {page}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
