"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Search, X, ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function GaleriPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita`);
        const json = await res.json();
        if (!mounted) return;
        if (json && Array.isArray(json.data)) {
          const items = json.data.flatMap((b: any) => {
            const imgs = Array.isArray(b.gambar_berita) ? b.gambar_berita : [];
            return imgs.map((img: string, idx: number) => ({
              id: `${b.id_berita}_${idx}`,
              beritaId: b.id_berita,
              title: b.judul_berita,
              category: b.kategori,
              date: b.tanggal_pelaksanaan || b.created_at,
              description: b.deskripsi,
              image: img,
            }));
          });
          setGallery(items);
        } else {
          setGallery([]);
        }
      } catch (e) {
        setError('Gagal memuat galeri');
        setGallery([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const categories = ["Semua", ...Array.from(new Set(gallery.map(g => g.category).filter(Boolean)))];

  const filteredGallery = selectedCategory === "Semua" 
    ? gallery 
    : gallery.filter(item => item.category === selectedCategory);

  const searchedGallery = searchQuery
    ? filteredGallery.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredGallery;

  const openLightbox = (imageId: string) => {
    const index = searchedGallery.findIndex(item => item.id === imageId);
    setCurrentImageIndex(index);
    setSelectedImage(imageId);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % searchedGallery.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(searchedGallery[nextIndex].id);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + searchedGallery.length) % searchedGallery.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(searchedGallery[prevIndex].id);
  };

  const toggleDescription = (imageId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(imageId)) {
      newExpanded.delete(imageId);
    } else {
      newExpanded.add(imageId);
    }
    setExpandedDescriptions(newExpanded);
  };

  // Fungsi untuk memotong deskripsi menjadi lebih singkat
  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const currentImage = selectedImage ? searchedGallery.find(item => item.id === selectedImage) : null;

  // Fungsi untuk download gambar
  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback: buka gambar di tab baru
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Galeri Desa
            </h1>
            <p 
              className="text-lg md:text-xl text-emerald-100 leading-relaxed"
            >
              Dokumentasi kegiatan dan keindahan Desa Sukamaju dalam gambar
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Gallery Grid */}
          <div className="lg:w-2/3">
            {/* Search and Filter */}
            <section className="py-6 bg-white shadow-sm rounded-lg mb-6">
              <div className="px-6">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between">
                  {/* Search */}
                  <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cari foto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all duration-200 text-sm md:text-base ${
                          category === selectedCategory
                            ? "bg-emerald-600 text-white shadow-md"
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

            {/* Gallery Grid */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
                  <p className="mt-4 text-gray-600">Memuat galeri...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{error}</h3>
                  <p className="text-gray-500">Silakan refresh halaman atau coba lagi nanti</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {searchedGallery.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`bg-gray-50 rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 border-2 ${
                          selectedImage === item.id 
                            ? "border-emerald-500 shadow-lg" 
                            : "border-transparent hover:border-emerald-300 hover:shadow-md"
                        }`}
                        onClick={() => openLightbox(item.id)}
                      >
                        <div className="aspect-video bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
                          {item.image && (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/uploads/berita/${item.image}`}
                              alt={item.title}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/0 flex items-center justify-center gap-2 group-hover:bg-black/20 transition-all duration-300">
                            <div className="bg-white/90 rounded-full p-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              <Search className="w-4 h-4 text-emerald-700" />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(
                                  `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/uploads/berita/${item.image}`,
                                  item.title.replace(/[^a-zA-Z0-9]/g, '_')
                                );
                              }}
                              className="bg-white/90 rounded-full p-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-100"
                              title="Download gambar"
                            >
                              <Download className="w-4 h-4 text-emerald-700" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  {searchedGallery.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada foto ditemukan</h3>
                      <p className="text-gray-500">Coba ubah kategori atau kata kunci pencarian</p>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Right Side - Preview Panel */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              {currentImage ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Preview Image */}
                  <div className="relative aspect-video bg-gray-900">
                    {currentImage.image && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/uploads/berita/${currentImage.image}`}
                        alt={currentImage.title}
                        className="object-cover w-full h-full"
                      />
                    )}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => downloadImage(
                          `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/uploads/berita/${currentImage.image}`,
                          currentImage.title.replace(/[^a-zA-Z0-9]/g, '_')
                        )}
                        className="bg-black/70 hover:bg-emerald-600 text-white p-2 rounded transition-colors duration-200"
                        title="Download gambar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {currentImageIndex + 1} / {searchedGallery.length}
                      </span>
                    </div>
                  </div>

                  {/* Image Details */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      {currentImage.title}
                    </h2>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                        <span>{new Date(currentImage.date).toLocaleDateString('id-ID', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="mb-3">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                          {currentImage.category}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {/* Deskripsi singkat di panel preview */}
                        {truncateDescription(currentImage.description) || "Tidak ada deskripsi tersedia."}
                      </p>
                      
                      {/* Tombol Aksi di Panel Preview */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => downloadImage(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/uploads/berita/${currentImage.image}`,
                            currentImage.title.replace(/[^a-zA-Z0-9]/g, '_')
                          )}
                          className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download Gambar
                        </button>
                        {currentImage.description && currentImage.description.length > 150 && (
                          <Link 
                            href={`/berita/${currentImage.beritaId}`}
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
                          >
                            Baca Berita Lengkap
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Navigation */}
                    {searchedGallery.length > 1 && (
                      <div className="flex gap-2 mt-6">
                        <button
                          onClick={prevImage}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Sebelumnya
                        </button>
                        <button
                          onClick={nextImage}
                          className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          Selanjutnya
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Pilih Foto</h3>
                  <p className="text-gray-500 text-sm">
                    Klik pada salah satu foto di galeri untuk melihat preview dan detail lengkapnya di sini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <section className="py-12 md:py-16 bg-white mt-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8 md:mb-12">Statistik Galeri</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-lg">{gallery.length}</span>
              </div>
              <h3 className="text-sm md:text-base font-semibold text-gray-800">Total Foto</h3>
            </div>
            
            {categories.slice(1).map((category) => {
              const count = gallery.filter((item: any) => item.category === category).length;
              return (
                <div key={category} className="text-center p-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm md:text-lg">{count}</span>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">{category}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}