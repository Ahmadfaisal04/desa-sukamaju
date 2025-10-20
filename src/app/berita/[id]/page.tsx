"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, Share2, Heart, MessageCircle, Eye } from "lucide-react";

interface BeritaDetail {
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
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <span className="text-gray-500">Memuat berita...</span>
        </div>
      </div>
    );
  }

  if (error || !berita) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/berita"
              className="inline-flex items-center space-x-2 text-emerald-100 hover:text-white mb-6 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Berita</span>
            </Link>
            
            <div className="flex items-center space-x-4 text-emerald-100 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(berita.tanggal_pelaksanaan).toLocaleDateString('id-ID')}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span className="bg-emerald-500/30 px-3 py-1 rounded-full text-sm font-medium">
                  {berita.kategori}
                </span>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
              {berita.judul_berita}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Image Gallery */}
            {berita.gambar_berita && berita.gambar_berita.length > 0 && (
              <div className="mb-8">
                {/* Main Image */}
                <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${berita.gambar_berita[selectedImageIndex]}`}
                    alt={berita.judul_berita}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjE4cHgiPkdhbWJhciBUaWRhayBUZXJzZWRpYTwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                </div>

                {/* Thumbnail Gallery */}
                {berita.gambar_berita.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {berita.gambar_berita.map((gambar, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImageIndex === index
                            ? 'border-emerald-500 scale-105'
                            : 'border-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${gambar}`}
                          alt={`${berita.judul_berita} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjlmYWZiIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtc2l6ZT0iMTBweCI+SW1nPC90ZXh0Pgo8L3N2Zz4=';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Article Content */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Article Meta */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                <div className="flex items-center space-x-4">
                  {/* Penulis dihapus */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Eye className="w-5 h-5" />
                    <span>1,234 views</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200">
                    <Heart className="w-5 h-5" />
                    <span>123</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <MessageCircle className="w-5 h-5" />
                    <span>45</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Article Text */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {berita.deskripsi}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 font-medium">Kategori:</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                    {berita.kategori}
                  </span>
                </div>
              </div>
            </div>

            {/* Back to News */}
            <div className="mt-8 text-center">
              <Link
                href="/berita"
                className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali ke Berita</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}