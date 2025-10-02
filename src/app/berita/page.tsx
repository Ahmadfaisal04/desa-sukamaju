import Link from "next/link";
import { Calendar, User, Tag, Search, ChevronRight } from "lucide-react";
import { newsData } from "@/data/news";

export default function BeritaPage() {
  const categories = ["Semua", "Pembangunan", "Budaya", "Kesehatan", "Ekonomi", "Pendidikan"];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Berita Desa
            </h1>
            <p className="text-xl lg:text-2xl text-emerald-100 leading-relaxed">
              Dapatkan informasi terkini seputar kegiatan dan perkembangan di Desa Sejahtera
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berita..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    category === "Semua"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Berita Utama</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Featured News */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold text-lg">Foto Berita Utama</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(newsData[0].date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{newsData[0].author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                        {newsData[0].category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 hover:text-emerald-600 transition-colors duration-300">
                    {newsData[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {newsData[0].content.substring(0, 200)}...
                  </p>
                  <Link 
                    href={`/berita/${newsData[0].id}`}
                    className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300 group"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Side Featured News */}
            <div className="space-y-6">
              {newsData.slice(1, 3).map((news) => (
                <div key={news.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-blue-200 to-purple-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <span className="text-blue-700 font-semibold">Foto Berita</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(news.date).toLocaleDateString('id-ID')}</span>
                      <span>•</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {news.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {news.excerpt}
                    </p>
                    <Link 
                      href={`/berita/${news.id}`}
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
        </div>
      </section>

      {/* All News */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Semua Berita</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.map((news) => (
              <div key={news.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-100">
                <div className="aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold">Foto Berita</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(news.date).toLocaleDateString('id-ID')}</span>
                    <span>•</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      {news.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{news.author}</span>
                    </div>
                    <Link 
                      href={`/berita/${news.id}`}
                      className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm group"
                    >
                      <span>Baca</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
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