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
import { newsData } from "@/data/news";
import { galleryData } from "@/data/gallery";
import { organizationData } from "@/data/organization";
import Link from "next/link";

export default function AdminDashboard() {
  const recentNews = newsData.slice(0, 3);
  const recentGallery = galleryData.slice(0, 4);

  return (
    <div className="space-y-6">
      {" "}
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
      </div>{" "}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Berita
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {newsData.length}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Newspaper className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+2 minggu ini</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Galeri
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {galleryData.length}
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Camera className="w-7 h-7 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+5 minggu ini</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Struktur Organisasi
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {organizationData.length}
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
      </div>{" "}
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
            </div>{" "}
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Kelola Organisasi
              </h3>
              <p className="text-sm text-gray-600">Atur struktur organisasi</p>
            </div>
          </Link>{" "}
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
                <div key={news.id} className="flex items-start space-x-3 group">
                  <div className="w-16 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-blue-700 text-xs font-semibold">
                      IMG
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {news.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(news.date).toLocaleDateString("id-ID")}
                      </span>
                      <span>•</span>
                      <span>{news.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
                    <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                      <span className="text-emerald-700 font-semibold text-sm">
                        Foto
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
                          <Edit3 className="w-4 h-4" />
                        </button>
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
            </div>
          </div>
        </div>
      </div>
      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Aktivitas Terbaru</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Newspaper className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">
                  Berita baru ditambahkan: "Pembangunan Jalan Desa Tahap II
                  Dimulai"
                </p>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>2 jam yang lalu</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">
                  5 foto baru ditambahkan ke galeri "Kegiatan"
                </p>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>1 hari yang lalu</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">Data organisasi diperbarui</p>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>3 hari yang lalu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
