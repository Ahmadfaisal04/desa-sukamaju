import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter, MessageCircle } from "lucide-react";
import { newsData } from "@/data/news";
import { notFound } from "next/navigation";

interface NewsDetailProps {
  params: {
    id: string;
  };
}

export default function NewsDetail({ params }: NewsDetailProps) {
  const news = newsData.find(item => item.id === params.id);
  
  if (!news) {
    notFound();
  }

  const relatedNews = newsData.filter(item => item.id !== params.id && item.category === news.category).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <Link href="/berita" className="hover:text-emerald-600">Berita</Link>
            <span>/</span>
            <span className="text-gray-800">{news.title}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <Link 
              href="/berita"
              className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Kembali ke Berita</span>
            </Link>

            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              <div className="aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold text-lg">Foto Berita</span>
                </div>
              </div>

              <div className="p-8">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(news.date).toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{news.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="w-4 h-4" />
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                      {news.category}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                  {news.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                  {news.excerpt}
                </p>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {news.content}
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>

                {/* Share Buttons */}
                <div className="border-t pt-8 mt-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Share2 className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 font-medium">Bagikan:</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        <Facebook className="w-4 h-4" />
                        <span className="hidden sm:block">Facebook</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors duration-300">
                        <Twitter className="w-4 h-4" />
                        <span className="hidden sm:block">Twitter</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:block">WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Berita Terkait</h3>
                <div className="space-y-4">
                  {relatedNews.map((relatedItem) => (
                    <Link 
                      key={relatedItem.id}
                      href={`/berita/${relatedItem.id}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        <div className="w-20 h-16 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-emerald-700 text-xs font-semibold">Foto</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 mb-1">
                            {relatedItem.title}
                          </h4>
                          <p className="text-sm text-gray-500 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(relatedItem.date).toLocaleDateString('id-ID')}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Kategori</h3>
              <div className="space-y-2">
                {["Pembangunan", "Budaya", "Kesehatan", "Ekonomi", "Pendidikan"].map((category) => (
                  <Link 
                    key={category}
                    href={`/berita?category=${category}`}
                    className="block text-gray-600 hover:text-emerald-600 transition-colors duration-300 py-1"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Info Kontak</h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-700">
                  <strong>Email:</strong> info@desasejahtera.id
                </p>
                <p className="text-gray-700">
                  <strong>Telepon:</strong> (021) 1234-5678
                </p>
                <p className="text-gray-700">
                  <strong>Alamat:</strong> Jl. Raya Desa No. 123, Kecamatan Sejahtera
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}