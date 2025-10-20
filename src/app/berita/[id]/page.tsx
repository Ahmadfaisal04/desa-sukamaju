"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, Share2, Heart, MessageCircle, Eye, Clock, User } from "lucide-react";

interface BeritaDetail {
  id_berita: string;
  judul_berita: string;
  kategori: string;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  gambar_berita: string[];
  created_at: string;
  penulis?: string;
}

interface BeritaItem {
  id_berita: string;
  judul_berita: string;
  kategori: string;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  gambar_berita: string[];
  created_at: string;
}

export default function BeritaDetailPage() {
  const params = useParams();
  const [berita, setBerita] = useState<BeritaDetail | null>(null);
  const [relatedBerita, setRelatedBerita] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchBeritaDetail(params.id as string);
    }
  }, [params.id]);

  const fetchBeritaDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita/${id}`);
      const result = await response.json();

      if (result.code === 200 && result.data) {
        setBerita(result.data);
        setError(null);
        // Fetch related news after main news is loaded
        fetchRelatedBerita(result.data.kategori, id);
      } else {
        setError(result.message || "Gagal mengambil detail berita");
      }
    } catch (error) {
      console.error("Error fetching berita detail:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBerita = async (kategori: string, currentId: string) => {
    try {
      setLoadingRelated(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita`);
      const result = await response.json();

      if (result.code === 200 && result.data) {
        // Filter berita dengan kategori yang sama, kecuali berita saat ini
        const related = result.data
          .filter((item: BeritaItem) => 
            item.kategori === kategori && 
            item.id_berita !== currentId
          )
          .slice(0, 2); // Ambil maksimal 2 berita terkait
        
        setRelatedBerita(related);
      }
    } catch (error) {
      console.error("Error fetching related berita:", error);
    } finally {
      setLoadingRelated(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <span className="text-gray-500">Memuat berita...</span>
        </div>
      </div>
    );
  }

  if (error || !berita) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Berita Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">{error || "Berita yang Anda cari tidak tersedia"}</p>
          <Link
            href="/berita"
            className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Berita</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/berita"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Berita</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors duration-200 p-2">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Meta */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(berita.tanggal_pelaksanaan).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
          
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <Tag className="w-3 h-3 mr-1" />
            {berita.kategori}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {berita.judul_berita}
        </h1>

        {/* Featured Image */}
        {berita.gambar_berita && berita.gambar_berita.length > 0 && (
          <div className="mb-8">
            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${berita.gambar_berita[selectedImageIndex]}`}
                alt={berita.judul_berita}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4Ij5HYW1iYXIgQmVyaXRhPC90ZXh0Pgo8L3N2Zz4=';
                }}
              />
            </div>

            {/* Image Gallery */}
            {berita.gambar_berita.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto border-b border-gray-200 pb-6 mb-8">
                {berita.gambar_berita.map((gambar, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-emerald-500 scale-110 shadow-md'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${gambar}`}
                      alt={`${berita.judul_berita} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjlmYWZiIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwcHgiPkltZzwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg">
            {/* Article Body */}
            <div className="text-gray-700 leading-relaxed text-base md:text-lg">
              {berita.deskripsi.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6 leading-8">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 font-medium">Bagikan:</span>
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {berita.kategori}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/berita"
            className="inline-flex items-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Daftar Berita</span>
          </Link>
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedBerita.length > 0 && (
        <section className="bg-gray-50 py-12 mt-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Berita Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedBerita.map((related) => (
                <Link 
                  key={related.id_berita} 
                  href={`/berita/${related.id_berita}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(related.tanggal_pelaksanaan).toLocaleDateString('id-ID')}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {related.judul_berita}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {related.deskripsi}
                    </p>
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                        {related.kategori}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fallback jika tidak ada berita terkait */}
      {!loadingRelated && relatedBerita.length === 0 && (
        <section className="bg-gray-50 py-12 mt-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Berita Lainnya</h2>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Tidak ada berita terkait untuk saat ini.</p>
              <Link
                href="/berita"
                className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <span>Lihat Semua Berita</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}