"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  MoreVertical,
  Newspaper,
  X,
  Upload,
  FileImage,
} from "lucide-react";
import { newsData } from "@/data/news";

interface BeritaData {
  id_berita: string;
  judul_berita: string;
  kategori: string;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  gambar_berita: string[];
  created_at: string;
}

export default function AdminBeritaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [selectedNews, setSelectedNews] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [beritaData, setBeritaData] = useState<BeritaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    judul_berita: "",
    kategori: "",
    tanggal_pelaksanaan: "",
    deskripsi: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const filteredNews = beritaData.filter((berita) => {
    const matchesSearch =
      berita.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) ||
      berita.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "Semua" || berita.kategori === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectNews = (newsId: string) => {
    setSelectedNews((prev) =>
      prev.includes(newsId)
        ? prev.filter((id) => id !== newsId)
        : [...prev, newsId]
    );
  };

  const handleSelectAll = () => {
    setSelectedNews(
      selectedNews.length === filteredNews.length
        ? []
        : filteredNews.map((berita) => berita.id_berita)
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      judul_berita: "",
      kategori: "",
      tanggal_pelaksanaan: "",
      deskripsi: "",
    });
    setSelectedImages([]);
    setShowAddModal(false);
    setIsDragOver(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('judul_berita', formData.judul_berita);
      submitData.append('kategori', formData.kategori);
      submitData.append('tanggal_pelaksanaan', formData.tanggal_pelaksanaan);
      submitData.append('deskripsi', formData.deskripsi);

      // Append multiple images
      selectedImages.forEach((image, index) => {
        submitData.append('gambar_berita', image);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/berita`, {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.code === 200) {
        alert('Berhasil menambahkan berita!');
        resetForm();
        // Refresh data instead of page reload
        fetchBeritaData();
      } else {
        alert(`Gagal menambahkan berita: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding news:', error);
      alert('Terjadi kesalahan saat menambahkan berita');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Berita</h1>
          <p className="text-gray-600 mt-1">
            Kelola semua konten berita website Desa Sukamaju
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Berita</span>
        </button>
      </div>{" "}
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Berita
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '-' : beritaData.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {categories.slice(1, 4).map((category, index) => {
          const count = beritaData.filter(
            (berita) => berita.kategori === category
          ).length;
          const colors = [
            { bg: "bg-emerald-100", text: "text-emerald-600" },
            { bg: "bg-purple-100", text: "text-purple-600" },
            { bg: "bg-orange-100", text: "text-orange-600" },
          ];
          const color = colors[index] || colors[0];

          return (
            <div
              key={category}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {category}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '-' : count}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center`}
                >
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
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedNews.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedNews.length} dipilih
                </span>
                <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
                  Hapus Terpilih
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* News Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedNews.length === filteredNews.length &&
                      filteredNews.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Berita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <span className="text-gray-500">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-red-600">{error}</span>
                      <button 
                        onClick={fetchBeritaData}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNews.map((berita) => (
                  <tr key={berita.id_berita} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedNews.includes(berita.id_berita)}
                        onChange={() => handleSelectNews(berita.id_berita)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {berita.gambar_berita && berita.gambar_berita.length > 0 ? (
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
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
                            <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-200 rounded-lg flex items-center justify-center hidden">
                              <span className="text-emerald-700 text-xs font-semibold">IMG</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-12 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <span className="text-emerald-700 text-xs font-semibold">IMG</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 line-clamp-2">
                            {berita.judul_berita}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {berita.deskripsi}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {berita.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(berita.tanggal_pelaksanaan).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/berita/${berita.id_berita}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Lihat"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/berita/edit/${berita.id_berita}`}
                          className="p-2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {beritaData.length === 0 ? "Belum ada berita" : "Tidak ada berita ditemukan"}
            </h3>
            <p className="text-gray-500 mb-4">
              {beritaData.length === 0 
                ? "Mulai dengan menambahkan berita pertama" 
                : "Coba ubah filter atau kata kunci pencarian"
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Berita {beritaData.length === 0 ? "Pertama" : "Baru"}</span>
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredNews.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Menampilkan {filteredNews.length} dari {beritaData.length} berita
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Sebelumnya
                </button>
                <button className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add News Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Tambah Berita Baru</h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Judul Berita */}
              <div>
                <label htmlFor="judul_berita" className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  id="judul_berita"
                  name="judul_berita"
                  value={formData.judul_berita}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Masukkan judul berita..."
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  id="kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Pembangunan">Pembangunan</option>
                  <option value="Budaya">Budaya</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Pendidikan">Pendidikan</option>
                </select>
              </div>

              {/* Tanggal Pelaksanaan */}
              <div>
                <label htmlFor="tanggal_pelaksanaan" className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Pelaksanaan *
                </label>
                <input
                  type="date"
                  id="tanggal_pelaksanaan"
                  name="tanggal_pelaksanaan"
                  value={formData.tanggal_pelaksanaan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi *
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Masukkan deskripsi berita..."
                  required
                />
              </div>

              {/* Upload Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Berita
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                    isDragOver 
                      ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-lg' 
                      : 'border-gray-300 hover:border-emerald-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2 w-full h-full"
                  >
                    <Upload className={`w-8 h-8 transition-colors duration-200 ${
                      isDragOver ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm transition-colors duration-200 ${
                      isDragOver ? 'text-emerald-700 font-medium' : 'text-gray-600'
                    }`}>
                      {isDragOver ? 'Lepaskan gambar di sini' : 'Klik untuk upload gambar atau drag & drop'}
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
                      Gambar Terpilih ({selectedImages.length})
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
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    "Simpan Berita"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
