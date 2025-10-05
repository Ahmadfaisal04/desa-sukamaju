"use client";

import { useState } from "react";
import { galleryData } from "@/data/gallery";
import {
  Calendar,
  Tag,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    "Semua",
    ...Array.from(new Set(galleryData.map((item) => item.category))),
  ];

  const filteredGallery =
    selectedCategory === "Semua"
      ? galleryData
      : galleryData.filter((item) => item.category === selectedCategory);

  const openLightbox = (imageId: string) => {
    const index = filteredGallery.findIndex((item) => item.id === imageId);
    setCurrentImageIndex(index);
    setSelectedImage(imageId);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredGallery.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredGallery[nextIndex].id);
  };

  const prevImage = () => {
    const prevIndex =
      (currentImageIndex - 1 + filteredGallery.length) % filteredGallery.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredGallery[prevIndex].id);
  };

  const currentImage = selectedImage
    ? filteredGallery.find((item) => item.id === selectedImage)
    : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {" "}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl lg:text-6xl font-bold mb-6"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              Galeri Desa
            </h1>
            <p
              className="text-xl lg:text-2xl text-emerald-100 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="1000"
            >
              Dokumentasi kegiatan dan keindahan Desa Sejahtera dalam gambar
            </p>
          </div>
        </div>
      </section>{" "}
      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            {/* Search */}
            <div
              className="relative flex-1 max-w-md"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari foto..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div
              className="flex flex-wrap gap-2"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-all duration-200 hover-lift ${
                    category === selectedCategory
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
      </section>{" "}
      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer hover-lift"
                onClick={() => openLightbox(item.id)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="600"
              >
                <div className="aspect-square bg-gradient-to-br from-emerald-200 to-teal-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center group-hover:bg-emerald-600/40 transition-colors duration-300">
                    <span className="text-emerald-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Klik untuk melihat
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(item.date).toLocaleDateString("id-ID")}
                    </span>
                    <span>•</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak ada foto ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kategori atau kata kunci pencarian
              </p>
            </div>
          )}
        </div>
      </section>
      {/* Lightbox Modal */}
      {selectedImage && currentImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {filteredGallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
                <span className="text-emerald-700 font-semibold text-xl">
                  Foto Galeri
                </span>
              </div>

              {/* Image Info */}
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(currentImage.date).toLocaleDateString("id-ID")}
                  </span>
                  <span>•</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                    {currentImage.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {currentImage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentImage.description}
                </p>

                {filteredGallery.length > 1 && (
                  <div className="mt-4 text-sm text-gray-500">
                    {currentImageIndex + 1} dari {filteredGallery.length} foto
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Statistik Galeri
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {galleryData.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Total Foto
              </h3>
            </div>

            {categories.slice(1).map((category) => {
              const count = galleryData.filter(
                (item) => item.category === category
              ).length;
              return (
                <div key={category} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {count}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
