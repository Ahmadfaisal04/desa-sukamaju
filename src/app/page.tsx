import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Building, Calendar, ChevronRight } from "lucide-react";
import { newsData } from "@/data/news";

export default function Home() {
  const latestNews = newsData.slice(0, 3);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Selamat Datang di
                <span className="block text-emerald-200">Desa Sukamaju</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-emerald-100 leading-relaxed">
                Desa yang maju, mandiri, dan sejahtera bagi semua warga masyarakat
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/tentang"
                  className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Tentang Desa</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  href="/berita"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Berita Terkini</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-semibold mb-6">Info Desa</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-emerald-200" />
                    <span>Kecamatan Karossa, Kabupaten Mamuju Tengah</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-emerald-200" />
                    <span>5.432 Jiwa (1.654 KK)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-6 h-6 text-emerald-200" />
                    <span>3 Dusun, 8 RW, 24 RT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">5.432</h3>
              <p className="text-gray-600">Total Penduduk</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">1.654</h3>
              <p className="text-gray-600">Kepala Keluarga</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">3</h3>
              <p className="text-gray-600">Dusun</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-orange-600 mb-2">24</h3>
              <p className="text-gray-600">Rukun Tetangga</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Berita Terkini</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dapatkan informasi terbaru seputar kegiatan dan perkembangan di Desa Sukamaju
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {latestNews.map((news, index) => (
              <div key={news.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold">Foto Berita {index + 1}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(news.date).toLocaleDateString('id-ID')}</span>
                    <span>•</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      {news.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <Link 
                    href={`/berita/${news.id}`}
                    className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium group"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/berita"
              className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Visi & Misi Desa</h2>
              
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-emerald-600 mb-4">Visi</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Terwujudnya Desa Sukamaju yang maju, mandiri, dan sejahtera berdasarkan gotong royong dan kearifan lokal"
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-emerald-600 mb-4">Misi</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Meningkatkan kualitas pelayanan publik yang prima</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Mengembangkan potensi ekonomi desa berbasis kearifan lokal</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Memperkuat persatuan dan kesatuan masyarakat</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Melestarikan budaya dan tradisi lokal</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">DS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-700">Desa Sukamaju</h3>
                  <p className="text-emerald-600 font-medium">Maju Bersama</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
