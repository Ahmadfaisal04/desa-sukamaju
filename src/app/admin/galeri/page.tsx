"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, Filter, Edit3, Trash2, Eye, 
  Calendar, User, Tag, MoreVertical, Camera, Upload 
} from "lucide-react";
import { galleryData } from "@/data/gallery";

export default function AdminGaleriPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [selectedGallery, setSelectedGallery] = useState<string[]>([]);

  const categories = ["Semua", "Kegiatan", "Pembangunan", "Budaya", "Olahraga", "Lainnya"];
  
  const filteredGallery = galleryData.filter(item => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Galeri</h1>
          <p className="text-gray-600 mt-1">Kelola semua foto dan gambar website Desa Sukamaju</p>
        </div>
        <Link
          href="/admin/galeri/tambah"
          className="inline-flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Foto</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Foto</p>
              <p className="text-3xl font-bold text-gray-900">{galleryData.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {categories.slice(1, 4).map((category, index) => {
          const count = galleryData.filter(item => item.category === category).length;
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
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
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
                <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
                  Hapus Terpilih
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
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedGallery.length === filteredGallery.length && filteredGallery.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Pilih Semua</span>
            </div>
          </div>

          {filteredGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                      <span className="text-purple-700 font-semibold text-sm">Foto</span>
                    </div>
                    
                    {/* Checkbox overlay */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedGallery.includes(item.id)}
                        onChange={() => handleSelectGallery(item.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
          ) : (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada foto ditemukan</h3>
              <p className="text-gray-500 mb-4">Coba ubah filter atau kata kunci pencarian</p>
              <Link
                href="/admin/galeri/tambah"
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Foto Pertama</span>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredGallery.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Menampilkan {filteredGallery.length} dari {galleryData.length} foto
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
      </div>
    </div>
  );
}
