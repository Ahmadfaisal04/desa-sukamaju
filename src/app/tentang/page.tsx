"use client";

import {
  MapPin,
  Users,
  Building,
  Calendar,
  Award,
  TreePine,
  Wheat,
  School,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface KontakData {
  id_kontak: string;
  email: string;
  telepon: string;
  facebook: string;
  youtube: string;
  instagram: string;
}

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
  startAnimation,
}: {
  icon: any;
  value: number;
  label: string;
  color: string;
  startAnimation: boolean;
}) => {
  const animatedValue = useCountUp(value, 2000, startAnimation);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
      <div
        className={`w-16 h-16 ${color} rounded-full mx-auto mb-4 flex items-center justify-center`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3
        className={`text-2xl font-bold ${color.replace("bg-", "text-")} mb-2`}
      >
        {label === "Luas Wilayah"
          ? "15,5 km²"
          : label === "Tahun Berdiri"
          ? "2004"
          : animatedValue.toLocaleString("id-ID")}
      </h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default function TentangDesa() {
  const [startStatsAnimation, setStartStatsAnimation] = useState(false);
  const [kontakData, setKontakData] = useState<KontakData | null>(null);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchKontakData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/kontak/b094eab0-a132-11f0-b34c-482ae3455d6d`
        );
        const result = await response.json();

        if (result.code === 200 && result.data) {
          setKontakData(result.data);
        }
      } catch (error) {
        console.error("Error fetching kontak data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKontakData();
  }, []);

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

  const handleSubmitPengaduan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ambil data dari form
    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const telepon = formData.get("telepon") as string;
    const kategori = formData.get("kategori") as string;
    const pesan = formData.get("pesan") as string;

    // Validasi form
    if (!nama || !email || !kategori || !pesan) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    // Format pesan untuk WhatsApp
    const whatsappMessage = `
*PENGADUAN DESA SUKAMAJU*

*Nama:* ${nama}
*Email:* ${email}
*Telepon:* ${telepon || "Tidak diisi"}
*Kategori:* ${kategori.charAt(0).toUpperCase() + kategori.slice(1)}

*Pesan:*
${pesan}

---
Dikirim melalui Website Desa Sukamaju
Tanggal: ${new Date().toLocaleDateString("id-ID")}
    `.trim();

    // Nomor WhatsApp tujuan dari API atau fallback
    const defaultWhatsapp = "62882022452792"; // Fallback jika API tidak tersedia
    let whatsappNumber = defaultWhatsapp;

    // Gunakan nomor dari API jika tersedia
    if (kontakData?.telepon) {
      // Pastikan format nomor dimulai dengan 62
      let apiNumber = kontakData.telepon.replace(/[^0-9]/g, ""); // Hapus karakter non-digit
      if (apiNumber.startsWith("0")) {
        apiNumber = "62" + apiNumber.substring(1); // Ganti 0 dengan 62
      } else if (!apiNumber.startsWith("62")) {
        apiNumber = "62" + apiNumber; // Tambah 62 jika belum ada
      }
      whatsappNumber = apiNumber;
    }

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Buat URL WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Buka WhatsApp di tab baru
    window.open(whatsappURL, "_blank");

    // Reset form setelah submit
    e.currentTarget.reset();

    // Tampilkan pesan sukses
    alert("Pengaduan Anda akan dikirim melalui WhatsApp. Terima kasih!");
  };
  return (
    <div className="bg-gray-50">
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
              Tentang Desa Sukamaju
            </h1>
            <p
              className="text-xl lg:text-2xl text-emerald-100 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="1000"
            >
              Mengenal lebih dekat sejarah, visi misi, dan potensi desa yang
              kaya akan budaya dan tradisi
            </p>
          </div>
        </div>
      </section>{" "}
      {/* Profile Desa */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right" data-aos-duration="800">
              <h2
                className="text-4xl font-bold text-gray-800 mb-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Profil Desa
              </h2>{" "}
              <p
                className="text-lg text-gray-700 leading-relaxed mb-6"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                Desa Sukamaju merupakan salah satu Desa di Kecamatan Karossa,
                Kabupaten Mamuju Tengah, Provinsi Sulawesi Barat. Desa Sukamaju
                terletak di sebelah barat Kecamatan Karossa dengan jarak tempuh
                7 Km dan jarak tempuh dari Kecamatan Karossa 8 km, sedangkan
                jarak tempuh dari Kabupaten Mamuju Tengah 141 km.
              </p>
              <p
                className="text-lg text-gray-700 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                Desa Sukamaju memiliki luas wilayah 2.350 Ha dan jumlah penduduk
                1.698 jiwa terdiri dari laki-laki 889 jiwa, perempuan 817 jiwa,
                sedangkan jumlah Kepala Keluarga 461 KK.
              </p>
            </div>
            <div
              className="relative"
              data-aos="fade-left"
              data-aos-delay="400"
              data-aos-duration="800"
            >
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center p-8">
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
      </section>{" "}
      {/* Data Wilayah */}
      <section ref={statsRef} className="py-16 bg-gray-50">
        {" "}
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-12"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Data Wilayah
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Informasi terkini mengenai demografi dan administrasi Desa
              Sukamaju
            </p>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              data-aos="zoom-in"
              data-aos-delay="200"
              data-aos-duration="600"
            >
              <StatCard
                icon={MapPin}
                value={15.5}
                label="Luas Wilayah"
                color="bg-emerald-600"
                startAnimation={startStatsAnimation}
              />
            </div>
            <div
              data-aos="zoom-in"
              data-aos-delay="300"
              data-aos-duration="600"
            >
              <StatCard
                icon={Users}
                value={5432}
                label="Jumlah Penduduk"
                color="bg-blue-600"
                startAnimation={startStatsAnimation}
              />
            </div>
            <div
              data-aos="zoom-in"
              data-aos-delay="400"
              data-aos-duration="600"
            >
              <StatCard
                icon={Building}
                value={1654}
                label="Kepala Keluarga"
                color="bg-purple-600"
                startAnimation={startStatsAnimation}
              />
            </div>
            <div
              data-aos="zoom-in"
              data-aos-delay="500"
              data-aos-duration="600"
            >
              <StatCard
                icon={Calendar}
                value={2004}
                label="Tahun Berdiri"
                color="bg-orange-600"
                startAnimation={startStatsAnimation}
              />
            </div>
          </div>{" "}
          <div
            className="mt-12 bg-white rounded-xl shadow-lg p-8"
            data-aos="fade-up"
            data-aos-delay="600"
            data-aos-duration="800"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Batas Wilayah
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Utara:</h4>
                <p className="text-gray-600">Desa Karossa</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Selatan:</h4>
                <p className="text-gray-600">Desa Lara</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Timur:</h4>
                <p className="text-gray-600">Desa Lembah Hopo</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Barat:</h4>
                <p className="text-gray-600">Selat Makassar</p>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Visi Misi */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-4xl font-bold text-gray-800 text-center mb-12"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              Visi & Misi
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100"
                data-aos="fade-right"
                data-aos-delay="300"
                data-aos-duration="800"
              >
                <div className="w-16 h-16 bg-emerald-600 rounded-full mb-6 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-600 mb-4">
                  Visi
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Mewujudkan Masyarakat Adil dan Makmur"
                </p>
              </div>{" "}
              <div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100"
                data-aos="fade-left"
                data-aos-delay="500"
                data-aos-duration="800"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full mb-6 flex items-center justify-center">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Misi</h3>
                <ul className="space-y-3">
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Mewujudkan tata Kelola pemerintahan yang baik
                    </span>
                  </li>
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-up"
                    data-aos-delay="800"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Meningkatkan kualitas insfratuktur yang berkelanjutan
                    </span>
                  </li>
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-up"
                    data-aos-delay="900"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Meningkatkan kualitas dan kuantitas Sumber Daya Manusia
                    </span>
                  </li>
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-up"
                    data-aos-delay="1000"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Meningkatkan Daya Saing Ekonomi berbasis inovasi dan
                      potensi desa
                    </span>
                  </li>
                  <li
                    className="flex items-start space-x-3"
                    data-aos="fade-up"
                    data-aos-delay="1000"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Meningkatkan kualitas pelayanan dalam bidang Pendidikan,
                      Kesehatan sosial dan hukum
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Potensi Desa */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2
            className="text-4xl font-bold text-gray-800 text-center mb-12"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            Potensi Desa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Wheat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Pertanian
              </h3>
              <p className="text-gray-600 text-center">
                Lahan pertanian seluas 8.5 km² dengan hasil padi, jagung, dan
                sayuran berkualitas tinggi
              </p>
            </div>{" "}
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <TreePine className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Kehutanan
              </h3>
              <p className="text-gray-600 text-center">
                Hutan konservasi seluas 3.2 km² sebagai paru-paru desa dan
                sumber mata air
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Pariwisata
              </h3>
              <p className="text-gray-600 text-center">
                Objek wisata alam dan budaya yang menarik wisatawan lokal dan
                mancanegara
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <School className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Pendidikan
              </h3>
              <p className="text-gray-600 text-center">
                Fasilitas pendidikan lengkap dari TK hingga SMA dengan kualitas
                terbaik
              </p>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Sejarah Singkat */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-4xl font-bold text-gray-800 text-center mb-12"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              Sejarah Singkat
            </h2>{" "}
            <div
              className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="800"
            >
              <p
                className="text-lg text-gray-700 leading-relaxed mb-6"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                Desa Sukamaju awalnya adalah salah satu desa dalam wilayah
                administratif Kecamatan Karossa Kabupaten Mamuju Tengah (Pecahan
                Kabupaten Mamuju). Desa ini berdiri otonom pada tahun 2004
                setelah mekar dari desa induk yaitu Desa Lara.
              </p>
              <p
                className="text-lg text-gray-700 leading-relaxed mb-6"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                Pada awalnya desa ini adalah daerah bagi warga transmigrasi yang
                bernama UPTD Lara 1. Pembukaan lahan dimulai pada tahun 1996,
                kemudian datanglah transmigran pendaratan pertama pada tahun
                1997 berjumlah 25 Kepala Keluarga (KK) dari Kabupaten Sidrap.
                Pada tahun 1998 terjadi pendaratan kedua berjumlah 100 KK dari
                Jawa, dan pendaratan ketiga sebanyak 75 KK dari APDT.
              </p>

              <div
                className="bg-white p-6 rounded-lg mb-6 border border-emerald-200"
                data-aos="fade-up"
                data-aos-delay="650"
              >
                <h4 className="text-xl font-semibold text-emerald-700 mb-3">
                  Kepemimpinan UPTD Lara 1
                </h4>
                <p className="text-gray-700 mb-3">
                  UPTD Lara 1 dipimpin oleh KUPT (Kepala Unit Pemukiman
                  Transmigrasi) yakni:
                </p>
                <ul className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>H. Tukimin</li>
                  <li>Alimuddin Rinjani</li>
                  <li>Ponidin</li>
                  <li>Bintang C</li>
                </ul>
              </div>

              <p
                className="text-lg text-gray-700 leading-relaxed mb-6"
                data-aos="fade-up"
                data-aos-delay="700"
              >
                Tahun 2004, UPTD Lara 1 diserahkan kepada Pemerintah Daerah
                Kabupaten Mamuju maka terbentuklah suatu otonomi baru yang
                diberi nama Desa Sukamaju.
              </p>

              <div
                className="bg-white p-6 rounded-lg border border-emerald-200"
                data-aos="fade-up"
                data-aos-delay="750"
              >
                <h4 className="text-xl font-semibold text-emerald-700 mb-4">
                  Kepemimpinan Desa Sukamaju
                </h4>
                <p className="text-gray-700 mb-4">
                  Pemimpin Desa Sukamaju sejak terbentuknya desa definitif
                  sampai sekarang:
                </p>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">Abdul Rahman H.Ag</span>
                    <span className="text-sm text-gray-600">
                      Penjabat Kepala Desa (2004-2007)
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">Abdul Rahman H.Ag</span>
                    <span className="text-sm text-gray-600">
                      Kepala Desa (2007-2013)
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">Muhammad Sahir C</span>
                    <span className="text-sm text-gray-600">
                      Kepala Desa (2014-2019)
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">Haeril Rijal P.S.IP</span>
                    <span className="text-sm text-gray-600">
                      Pejabat Desa (2020-2021)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Ahmad Dj Pababari</span>
                    <span className="text-sm text-gray-600">
                      Kepala Desa (2022-sekarang)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Form Pengaduan & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-12"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sampaikan aspirasi, pengaduan, atau pertanyaan Anda kepada kami
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Pengaduan */}
            <div
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
              data-aos="fade-right"
              data-aos-delay="300"
              data-aos-duration="800"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Form Pengaduan
                </h3>
                <p className="text-gray-600">
                  Silakan isi form di bawah ini untuk menyampaikan pengaduan
                  atau aspirasi Anda
                </p>
              </div>{" "}
              <form className="space-y-6" onSubmit={handleSubmitPengaduan}>
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    placeholder="nama@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="telepon"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="telepon"
                    name="telepon"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <label
                    htmlFor="kategori"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Kategori
                  </label>
                  <select
                    id="kategori"
                    name="kategori"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="pengaduan">Pengaduan</option>
                    <option value="aspirasi">Aspirasi</option>
                    <option value="informasi">Permintaan Informasi</option>
                    <option value="saran">Saran dan Masukan</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="pesan"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="pesan"
                    name="pesan"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 resize-none"
                    placeholder="Sampaikan pengaduan, aspirasi, atau pertanyaan Anda di sini..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Kirim Pengaduan
                </button>
              </form>
            </div>{" "}
            {/* Map & Kontak Info */}
            <div
              className="space-y-6"
              data-aos="fade-left"
              data-aos-delay="300"
              data-aos-duration="800"
            >
              {/* Map */}
              <div
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Lokasi Kantor Desa
                  </h3>
                  <p className="text-gray-600">
                    Kunjungi kantor desa untuk pelayanan langsung
                  </p>
                </div>
                <div className="h-80 bg-gray-100 relative overflow-hidden">
                  {/* Google Maps embed for Kantor Desa Suka Maju */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d646.260079640575!2d119.3818133405465!3d-1.8336358952405705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d8d0b3807183ae9%3A0xb115727f48569d64!2sKantor%20Desa%20Suka%20Maju!5e1!3m2!1sid!2sid!4v1759500799882!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      display: "block",
                      width: "100%",
                      height: "100%",
                    }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                    title="Lokasi Kantor Desa Suka Maju"
                  ></iframe>
                </div>
              </div>{" "}
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Alamat</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Jl. Raya Desa No. 123
                    <br />
                    Kec. Karossa, Kab. Mamuju Tengah
                    <br />
                    94654
                  </p>
                </div>

                <div
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Telepon</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {loading
                      ? "Loading..."
                      : kontakData?.telepon || "(021) 1234-5678"}
                    <br />
                    WhatsApp:{" "}
                    {loading
                      ? "Loading..."
                      : kontakData?.telepon || "+62 812-3456-7890"}
                  </p>
                </div>

                {/* Email Contact Card */}
                <div
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                  data-aos="fade-up"
                  data-aos-delay="800"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {loading
                      ? "Loading..."
                      : kontakData?.email || "info@desaSukamaju.id"}
                  </p>
                </div>

                {/* Service Hours Card */}
                <div
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                  data-aos="fade-up"
                  data-aos-delay="900"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      Jam Pelayanan
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Senin - Jumat</span>
                      <span className="font-medium text-gray-800">
                        08.00 - 16.00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sabtu - Minggu</span>
                      <span className="font-medium text-red-600">Tutup</span>
                    </div>
                  </div>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
