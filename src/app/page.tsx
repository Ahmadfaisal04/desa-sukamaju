"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  MapPin,
  Users,
  Building,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { newsData } from "@/data/news";

// Hook untuk animasi countup
const useCountUp = (
  end: number,
  duration: number = 2000,
  startAnimation: boolean = false
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function untuk animasi yang smooth
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, startAnimation]);

  return count;
};

// Komponen StatCard dengan animasi countup
const StatCard = ({
  icon: Icon,
  value,
  label,
  color,
  bgColor,
  borderColor,
  startAnimation,
}: {
  icon: any;
  value: number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  startAnimation: boolean;
}) => {
  const animatedValue = useCountUp(value, 2000, startAnimation);

  return (
    <div
      className={`text-center p-6 rounded-xl bg-gradient-to-br ${bgColor} border ${borderColor} transform hover:scale-105 transition-transform duration-300`}
    >
      <div
        className={`w-16 h-16 ${color} rounded-full mx-auto mb-4 flex items-center justify-center`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3
        className={`text-3xl font-bold ${color.replace("bg-", "text-")} mb-2`}
      >
        {animatedValue.toLocaleString("id-ID")}
      </h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default function Home() {
  const latestNews = newsData.slice(0, 3);
  const [startStatsAnimation, setStartStatsAnimation] = useState(false);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startStatsAnimation) {
            setStartStatsAnimation(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [startStatsAnimation]);

  return (
    <div className="bg-gray-50">
      {" "}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
                data-aos="fade-right"
                data-aos-duration="1000"
              >
                Selamat Datang di
                <span className="block text-emerald-200">Desa Sukamaju</span>
              </h1>
              <p
                className="text-xl lg:text-2xl mb-8 text-emerald-100 leading-relaxed"
                data-aos="fade-right"
                data-aos-delay="200"
                data-aos-duration="1000"
              >
                Desa yang maju, mandiri, dan sejahtera bagi semua warga
                masyarakat
              </p>
              <div
                className="flex flex-col sm:flex-row gap-4"
                data-aos="fade-up"
                data-aos-delay="400"
                data-aos-duration="1000"
              >
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
            </div>{" "}
            <div
              className="relative"
              data-aos="fade-left"
              data-aos-delay="300"
              data-aos-duration="1000"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover-glow">
                <h3 className="text-2xl font-semibold mb-6">Info Desa</h3>
                <div className="space-y-4">
                  <div
                    className="flex items-center space-x-3"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    <MapPin className="w-6 h-6 text-emerald-200" />
                    <span>Kecamatan Karossa, Kabupaten Mamuju Tengah</span>
                  </div>
                  <div
                    className="flex items-center space-x-3"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    <Users className="w-6 h-6 text-emerald-200" />
                    <span>5.432 Jiwa (1.654 KK)</span>
                  </div>
                  <div
                    className="flex items-center space-x-3"
                    data-aos="fade-up"
                    data-aos-delay="800"
                  >
                    <Building className="w-6 h-6 text-emerald-200" />
                    <span>3 Dusun, 8 RW, 24 RT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Quick Stats */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-12"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Data Statistik Desa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Informasi terkini mengenai demografi dan administrasi Desa
              Sukamaju
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {" "}
            <div
              data-aos="zoom-in"
              data-aos-delay="100"
              data-aos-duration="600"
            >
              <StatCard
                icon={Users}
                value={5432}
                label="Total Penduduk"
                color="bg-emerald-600"
                bgColor="from-emerald-50 to-teal-50"
                borderColor="border-emerald-100"
                startAnimation={startStatsAnimation}
              />
            </div>
            <div
              data-aos="zoom-in"
              data-aos-delay="200"
              data-aos-duration="600"
            >
              <StatCard
                icon={Building}
                value={1654}
                label="Kepala Keluarga"
                color="bg-blue-600"
                bgColor="from-blue-50 to-indigo-50"
                borderColor="border-blue-100"
                startAnimation={startStatsAnimation}
              />
            </div>
            <div
              data-aos="zoom-in"
              data-aos-delay="300"
              data-aos-duration="600"
            >
              <StatCard
                icon={MapPin}
                value={3}
                label="Dusun"
                color="bg-purple-600"
                bgColor="from-purple-50 to-pink-50"
                borderColor="border-purple-100"
                startAnimation={startStatsAnimation}
              />
            </div>
            <div
              data-aos="zoom-in"
              data-aos-delay="400"
              data-aos-duration="600"
            >
              <StatCard
                icon={Calendar}
                value={24}
                label="Rukun Tetangga"
                color="bg-orange-600"
                bgColor="from-orange-50 to-red-50"
                borderColor="border-orange-100"
                startAnimation={startStatsAnimation}
              />
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Latest News */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-12"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Berita Terkini
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dapatkan informasi terbaru seputar kegiatan dan perkembangan di
              Desa Sukamaju
            </p>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {latestNews.map((news, index) => (
              <div
                key={news.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover-lift"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="800"
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-200 to-teal-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold">
                      Foto Berita {index + 1}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(news.date).toLocaleDateString("id-ID")}
                    </span>
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
          </div>{" "}
          <div
            className="text-center"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="600"
          >
            <Link
              href="/berita"
              className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 hover-lift"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>{" "}
      {/* Vision Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-4xl font-bold text-gray-800 mb-8"
                data-aos="fade-right"
                data-aos-duration="800"
              >
                Visi & Misi Desa
              </h2>
              <div
                className="mb-8"
                data-aos="fade-right"
                data-aos-delay="200"
                data-aos-duration="800"
              >
                <h3 className="text-2xl font-semibold text-emerald-600 mb-4">
                  Visi
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Mewujudkan Masyarakat Adil dan Makmur"
                </p>
              </div>{" "}
              <div
                data-aos="fade-right"
                data-aos-delay="400"
                data-aos-duration="800"
              >
                <h3 className="text-2xl font-semibold text-emerald-600 mb-4">
                  Misi
                </h3>
                <ul className="space-y-3">
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-right"
                    data-aos-delay="600"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Mewujudkan tata Kelola pemerintahan yang baik
                    </span>
                  </li>
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-right"
                    data-aos-delay="700"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Meningkatkan kualitas insfratuktur yang berkelanjutan
                    </span>
                  </li>
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-right"
                    data-aos-delay="800"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Meningkatkan kualitas dan kuantitas Sumber Daya Manusia
                    </span>
                  </li>
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-right"
                    data-aos-delay="900"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Meningkatkan Daya Saing Ekonomi berbasis inovasi dan
                      potensi desa
                    </span>
                  </li>
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-right"
                    data-aos-delay="900"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Meningkatkan kualitas pelayanan dalam bidang Pendidikan,
                      Kesehatan sosial dan hukum
                    </span>
                  </li>
                </ul>
              </div>{" "}
            </div>
            <div
              className="relative"
              data-aos="fade-left"
              data-aos-delay="300"
              data-aos-duration="1000"
            >
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center p-8 hover-glow">
                <div className="text-center">
                  <div className="w-48 h-48 relative mx-auto mb-6">
                    <Image
                      src="/logo.png"
                      alt="Logo Desa Sukamaju"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-700">
                    Desa Sukamaju
                  </h3>
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
