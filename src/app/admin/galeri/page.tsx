"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Search, Filter, Edit3, Trash2, Eye, 
  Calendar, User, Tag, MoreVertical, Camera, Upload, X 
} from "lucide-react";
import { galleryData } from "@/data/gallery";

interface BeritaData {
  id_berita: string;
  judul_berita: string;
  kategori: string;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  gambar_berita: string[];
  created_at: string;
}

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  date: string;
  description: string;
  berita_id: string;
}

export default function AdminGaleriPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [selectedGallery, setSelectedGallery] = useState<string[]>([]);
  const [beritaData, setBeritaData] = useState<BeritaData[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBeritaId, setSelectedBeritaId] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [searchBerita, setSearchBerita] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data from API
  useEffect(() => {
    fetchBeritaData();
  }, []);

  // Prevent default drag behavior on window
  useEffect(() => {
    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);

    return () => {
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);
    };
  }, []);

  const fetchBeritaData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita`);
      const result = await response.json();

      if (result.code === 200) {
        setBeritaData(result.data || []);
        
        // Transform berita data to gallery items
        const gallery: GalleryItem[] = [];
        result.data.forEach((berita: BeritaData) => {
          // Only add berita that have images
          if (berita.gambar_berita && berita.gambar_berita.length > 0) {
            berita.gambar_berita.forEach((gambar, index) => {
              gallery.push({
                id: `${berita.id_berita}_${index}`,
                src: gambar,
                title: berita.judul_berita,
                category: berita.kategori,
                date: berita.tanggal_pelaksanaan,
                description: berita.deskripsi,
                berita_id: berita.id_berita
              });
            });
          }
        });
        
        setGalleryItems(gallery);
        setError(null);
      } else {
        setError(result.message || "Gagal mengambil data galeri");
      }
    } catch (error) {
      console.error("Error fetching berita data:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from berita data
  const getCategories = () => {
    const categories = new Set(beritaData.map(berita => berita.kategori));
    return ["Semua", ...Array.from(categories)];
  };

  const categories = getCategories();
  
  const filteredGallery = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "Semua" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectGallery = (galleryId: string) => {
    setSelectedGallery(prev => 
      prev.includes(galleryId) 
        ? prev.filter(id => id !== galleryId)
        : [...prev, galleryId]
    );
  };

  const handleSelectAll = () => {
    setSelectedGallery(
      selectedGallery.length === filteredGallery.length 
        ? [] 
        : filteredGallery.map(item => item.id)
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...imageFiles]);
    }
    
    if (files.length > imageFiles.length) {
      alert('Beberapa file diabaikan karena bukan file gambar');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetUploadForm = () => {
    setSelectedBeritaId("");
    setSelectedImages([]);
    setSearchBerita("");
    setShowDropdown(false);
    setShowUploadModal(false);
    setIsDragOver(false);
  };

  // Filter berita berdasarkan pencarian
  const filteredBeritaOptions = beritaData.filter(berita =>
    berita.judul_berita.toLowerCase().includes(searchBerita.toLowerCase()) ||
    berita.id_berita.toLowerCase().includes(searchBerita.toLowerCase())
  );

  // Get selected berita info
  const selectedBerita = beritaData.find(berita => berita.id_berita === selectedBeritaId);

  const handleBeritaSelect = (beritaId: string, beritaTitle: string) => {
    setSelectedBeritaId(beritaId);
    setSearchBerita(beritaId === "lainnya" ? "Lainnya - Upload gambar umum" : `${beritaId.slice(0, 5)} - ${beritaTitle}`);
    setShowDropdown(false);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBeritaId || selectedImages.length === 0) {
      alert("Pilih berita dan minimal satu foto");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      
      // Jika pilih "Lainnya", tidak perlu id_berita
      if (selectedBeritaId !== "lainnya") {
        formData.append('id_berita', selectedBeritaId);
      }
      
      selectedImages.forEach((image) => {
        formData.append('gambar', image);
      });

      // Tentukan endpoint berdasarkan pilihan
      const endpoint = selectedBeritaId === "lainnya" 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/galeri/photo`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita/photo`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.code === 200) {
        alert(selectedBeritaId === "lainnya" 
          ? 'Berhasil menambahkan foto ke galeri!' 
          : 'Berhasil menambahkan foto berita!'
        );
        resetUploadForm();
        fetchBeritaData(); // Refresh data
      } else {
        alert(`Gagal upload foto: ${result.message}`);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Terjadi kesalahan saat upload foto');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete single photo
  const handleDeletePhoto = async (filename: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/photo/berita/${filename}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.code === 200) {
        alert('Berhasil menghapus foto!');
        setDeleteConfirm(null);
        fetchBeritaData(); // Refresh data
      } else {
        alert(`Gagal menghapus foto: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Terjadi kesalahan saat menghapus foto');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk delete photos
  const handleBulkDelete = async () => {
    if (selectedGallery.length === 0) return;

    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedGallery.length} foto?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Get filenames from selected gallery items
      const filenames = selectedGallery.map(id => {
        const item = galleryItems.find(item => item.id === id);
        return item?.src;
      }).filter(Boolean) as string[];

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/bulk/photo/berita`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filenames }),
      });

      const result = await response.json();

      if (result.code === 200) {
        alert(`Berhasil menghapus ${selectedGallery.length} foto!`);
        setSelectedGallery([]);
        fetchBeritaData(); // Refresh data
      } else {
        alert(`Gagal menghapus foto: ${result.message}`);
      }
    } catch (error) {
      console.error('Error bulk deleting photos:', error);
      alert('Terjadi kesalahan saat menghapus foto');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get filename from gallery item ID
  const getFilenameFromId = (id: string) => {
    const item = galleryItems.find(item => item.id === id);
    return item?.src;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Galeri</h1>
          <p className="text-gray-600 mt-1">Kelola semua foto dan gambar website Desa Sukamaju</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Foto</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Foto</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '-' : galleryItems.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {categories.slice(1, 4).map((category, index) => {
          const count = galleryItems.filter(item => item.category === category).length;
          const colors = [
            { bg: 'bg-blue-100', text: 'text-blue-600' },
            { bg: 'bg-emerald-100', text: 'text-emerald-600' },
            { bg: 'bg-orange-100', text: 'text-orange-600' }
          ];
          const color = colors[index] || colors[0];
          
          return (
            <div key={category} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{category}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '-' : count}
                  </p>
                </div>
                <div className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center`}>
                  <Tag className={`w-6 h-6 ${color.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari foto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedGallery.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedGallery.length} dipilih</span>
                <button 
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Menghapus..." : "Hapus Terpilih"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Semua Foto</h2>
            {galleryItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedGallery.length === filteredGallery.length && filteredGallery.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">Pilih Semua</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <span className="text-gray-500">Memuat galeri...</span>
            </div>
          ) : galleryItems.length === 0 ? (
            // State ketika galeri kosong (tidak ada error)
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Galeri Masih Kosong</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Belum ada foto yang tersedia di galeri. Foto akan muncul otomatis dari berita yang memiliki gambar, 
                atau Anda bisa mengupload foto langsung ke galeri.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Foto ke Galeri</span>
                </button>
                <Link
                  href="/admin/berita"
                  className="inline-flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tambah Berita dengan Gambar</span>
                </Link>
              </div>
            </div>
          ) : filteredGallery.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGallery.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/berita/${item.src}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjE0cHgiPkdhbWJhcjwvdGV4dD4KPC9zdmc+';
                        }}
                      />
                      
                      {/* Checkbox overlay */}
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedGallery.includes(item.id)}
                          onChange={() => handleSelectGallery(item.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 bg-white/80 backdrop-blur-sm cursor-pointer"
                        />
                      </div>

                      {/* Delete button overlay */}
                      <div className="absolute top-2 right-2 z-10">
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          title="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredGallery.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 mt-6 -mx-6 -mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Menampilkan {filteredGallery.length} dari {galleryItems.length} foto
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                        Sebelumnya
                      </button>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                        1
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // State ketika ada foto tapi tidak ada yang sesuai filter
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada foto ditemukan</h3>
              <p className="text-gray-500 mb-4">
                Coba ubah filter atau kata kunci pencarian
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("Semua");
                }}
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <span>Reset Filter</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Upload Foto Berita</h3>
              <button
                onClick={resetUploadForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Click outside to close dropdown */}
            {showDropdown && (
              <div 
                className="fixed inset-0 z-5" 
                onClick={() => setShowDropdown(false)}
              ></div>
            )}

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              {/* Pilih Berita */}
              <div>
                <label htmlFor="berita_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Berita *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchBerita}
                    onChange={(e) => {
                      setSearchBerita(e.target.value);
                      setShowDropdown(true);
                      if (!e.target.value) {
                        setSelectedBeritaId("");
                      }
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Cari berita atau pilih 'Lainnya'..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    autoComplete="off"
                  />
                  
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {/* Option Lainnya */}
                      <div
                        onClick={() => handleBeritaSelect("lainnya", "Upload gambar umum")}
                        className="px-3 py-2 hover:bg-purple-50 cursor-pointer border-b border-gray-100"
                      >
                        <div className="font-medium text-purple-600">Lainnya - Upload gambar umum</div>
                        <div className="text-xs text-gray-500">Upload foto tanpa dikaitkan dengan berita tertentu</div>
                      </div>
                      
                      {/* Berita Options */}
                      {filteredBeritaOptions.length > 0 ? (
                        filteredBeritaOptions.map((berita) => (
                          <div
                            key={berita.id_berita}
                            onClick={() => handleBeritaSelect(berita.id_berita, berita.judul_berita)}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="font-medium">{berita.id_berita.slice(0, 5)} - {berita.judul_berita}</div>
                            <div className="text-xs text-gray-500">Kategori: {berita.kategori}</div>
                          </div>
                        ))
                      ) : searchBerita && searchBerita !== "Lainnya - Upload gambar umum" ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          Tidak ada berita yang cocok dengan "{searchBerita}"
                        </div>
                      ) : null}
                      
                      {!searchBerita && (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          Ketik untuk mencari berita atau pilih "Lainnya"
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {selectedBeritaId && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border text-sm">
                    {selectedBeritaId === "lainnya" ? (
                      <span className="text-purple-600">✓ Upload gambar umum (tidak dikaitkan dengan berita)</span>
                    ) : (
                      <span className="text-emerald-600">✓ Dipilih: {selectedBerita?.judul_berita}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Upload Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Berita *
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 relative ${
                    isDragOver 
                      ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg' 
                      : 'border-gray-300 hover:border-purple-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragOver && (
                    <div className="absolute inset-0 bg-purple-100 bg-opacity-75 rounded-lg flex items-center justify-center">
                      <div className="text-purple-600 font-medium text-lg">
                        Lepaskan foto di sini
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className={`w-8 h-8 transition-colors duration-200 ${
                      isDragOver ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm transition-colors duration-200 ${
                      isDragOver ? 'text-purple-700 font-medium' : 'text-gray-600'
                    }`}>
                      {isDragOver ? 'Lepaskan foto di sini' : 'Klik untuk upload foto atau drag & drop'}
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF hingga 10MB (Multiple files allowed)
                    </span>
                  </label>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Foto Terpilih ({selectedImages.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetUploadForm}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedBeritaId || selectedImages.length === 0}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Foto"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Hapus Foto
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeletePhoto(getFilenameFromId(deleteConfirm)!)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}