"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, Share2, Copy, Check, X } from "lucide-react";

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const shareToWhatsApp = () => {
    const url = getShareUrl();
    const text = `${berita?.judul_berita}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToFacebook = async () => {
    const url = getShareUrl();
    const text = `${berita?.judul_berita}\n\nBaca selengkapnya: ${url}`;
    
    // Salin link ke clipboard terlebih dahulu
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    
    // Buka halaman Facebook untuk membuat postingan baru
    alert('Link berita telah disalin!\n\nAnda akan diarahkan ke Facebook. Silakan tempel (paste) di kolom postingan.');
    window.open(`https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = getShareUrl();
    const text = berita?.judul_berita || '';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToTelegram = () => {
    const url = getShareUrl();
    const text = berita?.judul_berita || '';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram tidak mendukung direct share via URL, jadi kita buka Instagram dengan pesan untuk copy link
    copyToClipboard();
    alert('Link telah disalin! Buka Instagram dan paste di story atau DM Anda.');
    window.open('https://www.instagram.com/', '_blank');
  };

  const shareToEmail = () => {
    const url = getShareUrl();
    const subject = berita?.judul_berita || 'Berita Desa Sukamaju';
    const body = `${berita?.judul_berita}\n\nBaca selengkapnya: ${url}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const copyToClipboard = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: berita?.judul_berita,
          text: berita?.deskripsi.substring(0, 100) + '...',
          url: getShareUrl(),
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

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
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Bagikan Berita</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button 
                onClick={() => { shareToWhatsApp(); setShowShareModal(false); }}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>
              
              <button 
                onClick={() => { shareToFacebook(); setShowShareModal(false); }}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              
              <button 
                onClick={() => { shareToTwitter(); setShowShareModal(false); }}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">X</span>
              </button>
              
              <button 
                onClick={() => { shareToTelegram(); setShowShareModal(false); }}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500 text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Telegram</span>
              </button>
              
              <button 
                onClick={() => { shareToInstagram(); setShowShareModal(false); }}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Instagram</span>
              </button>
              
              <button 
                onClick={() => { shareToEmail(); setShowShareModal(false); }}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-600 text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Email</span>
              </button>
              
              <button 
                onClick={() => { copyToClipboard(); }}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                  copied ? 'bg-emerald-500' : 'bg-gray-200'
                } ${copied ? 'text-white' : 'text-gray-700'}`}>
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </div>
                <span className="text-xs text-gray-600">{copied ? 'Disalin!' : 'Salin Link'}</span>
              </button>
            </div>
            
            {/* Copy Link Input */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-3">
              <input 
                type="text" 
                value={getShareUrl()} 
                readOnly 
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none truncate"
              />
              <button 
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {copied ? 'Disalin!' : 'Salin'}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button 
                onClick={handleNativeShare}
                className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors duration-200 p-2"
              >
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
              <div className="flex flex-col gap-6">
                {/* Share Section */}
                <div className="flex flex-col space-y-3">
                  <span className="text-gray-600 font-medium">Bagikan:</span>
                  <div className="flex flex-wrap gap-2">
                    {/* WhatsApp */}
                    <button 
                      onClick={shareToWhatsApp}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                      title="Bagikan ke WhatsApp"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                    
                    {/* Facebook */}
                    <button 
                      onClick={shareToFacebook}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                      title="Bagikan ke Facebook"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    
                    {/* Twitter/X */}
                    <button 
                      onClick={shareToTwitter}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 text-white transition-colors duration-200"
                      title="Bagikan ke X (Twitter)"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </button>
                    
                    {/* Telegram */}
                    <button 
                      onClick={shareToTelegram}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200"
                      title="Bagikan ke Telegram"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </button>
                    
                    {/* Instagram */}
                    <button 
                      onClick={shareToInstagram}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white transition-all duration-200"
                      title="Bagikan ke Instagram"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </button>
                    
                    {/* Email */}
                    <button 
                      onClick={shareToEmail}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200"
                      title="Bagikan via Email"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    
                    {/* Copy Link */}
                    <button 
                      onClick={copyToClipboard}
                      className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${
                        copied 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      title={copied ? "Link disalin!" : "Salin Link"}
                    >
                      {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Category Section */}
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