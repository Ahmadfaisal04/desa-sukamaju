"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

interface AparatData {
  id_aparat: string;
  nama: string;
  jabatan: string;
  no_telepon: string;
  email: string;
  status: string;
  periode_mulai: string;
  periode_selesai: string;
  foto: string;
}

export default function StrukturOrganisasi() {
  const [aparatData, setAparatData] = useState<AparatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAparatData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aparat`
        );
        const result = await response.json();

        if (result.code === 200) {
          // Set data even if it's empty array
          setAparatData(result.data || []);
          setError(null); // Clear any previous errors
        } else {
          setError(result.message || "Gagal mengambil data aparat");
        }
      } catch (error) {
        console.error("Error fetching aparat data:", error);
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchAparatData();
  }, []);

  const kepalaDesa = aparatData.find(
    (member) => member.jabatan === "Kepala Desa"
  );
  const sekretarisDesa = aparatData.find(
    (member) => member.jabatan === "Sekretaris Desa"
  );
  const kepalaSeksi = aparatData.filter(
    (member) => member.jabatan.includes("Kasi")
  );
  const kepalaUrusan = aparatData.filter(
    (member) => member.jabatan.includes("Kaur")
  );
  const stafDesa = aparatData.filter(
    (member) => member.jabatan.includes("Staf")
  );
  const kepalaDusun = aparatData.filter((member) =>
    member.jabatan.includes("Kadus")
  );
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <span className="ml-4 text-gray-600 text-lg">
            Memuat data organisasi...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
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
                  Struktur Organisasi
                </h1>
                <p
                  className="text-xl lg:text-2xl text-emerald-100 leading-relaxed"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="1000"
                >
                  Mengenal para pemimpin dan perangkat desa yang mengabdi untuk
                  kemajuan Desa Sejahtera
                </p>
              </div>
            </div>
          </section>

          {/* Empty State */}
          {aparatData.length === 0 && (
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Data Organisasi Belum Tersedia
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Struktur organisasi desa sedang dalam proses pemutakhiran data. 
                    Silakan kembali lagi nanti untuk melihat informasi terbaru.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Show content only if data exists */}
          {aparatData.length > 0 && (
            <>
              {/* Kepala Desa */}
          {kepalaDesa && (
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h2
                    className="text-4xl font-bold text-gray-800 mb-12"
                    data-aos="fade-up"
                    data-aos-duration="800"
                  >
                    Kepala Desa
                  </h2>

                  <div
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 max-w-2xl mx-auto hover-lift"
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    data-aos-duration="800"
                  >
                    {kepalaDesa.foto ? (
                      <div className="w-32 h-32 relative rounded-full mx-auto mb-6 overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${kepalaDesa.foto}`}
                          alt={kepalaDesa.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold text-lg">
                          {kepalaDesa.nama
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {kepalaDesa.nama}
                    </h3>
                    <p className="text-lg text-emerald-600 font-semibold mb-4">
                      {kepalaDesa.jabatan}
                    </p>
                    <p className="text-gray-700 leading-relaxed max-w-lg mx-auto mb-2">
                      Periode: {kepalaDesa.periode_mulai} -{" "}
                      {kepalaDesa.periode_selesai}
                    </p>
                    <p className="text-gray-600 text-sm mb-6">
                      Status:{" "}
                      {kepalaDesa.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                    </p>
                    <div className="flex justify-center space-x-4 mt-6">
                      <a
                        href={`mailto:${kepalaDesa.email}`}
                        className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </a>
                      <a
                        href={`tel:${kepalaDesa.no_telepon}`}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Telepon</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}{" "}
          {/* Sekretaris Desa */}
          {sekretarisDesa && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2
                  className="text-4xl font-bold text-gray-800 text-center mb-12"
                  data-aos="fade-up"
                  data-aos-duration="800"
                >
                  Sekretaris Desa
                </h2>

                <div className="max-w-2xl mx-auto">
                  <div
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover-lift"
                    data-aos="zoom-in"
                    data-aos-duration="600"
                  >
                    {sekretarisDesa.foto ? (
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${sekretarisDesa.foto}`}
                          alt={sekretarisDesa.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                          <span className="text-blue-700 font-semibold text-lg">
                            {sekretarisDesa.nama
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                        {sekretarisDesa.nama}
                      </h3>
                      <p className="text-emerald-600 font-semibold mb-3">
                        {sekretarisDesa.jabatan}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        Periode: {sekretarisDesa.periode_mulai} - {sekretarisDesa.periode_selesai}
                      </p>
                      <p className="text-gray-500 text-xs mb-4">
                        Status: {sekretarisDesa.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                      </p>
                      <div className="flex space-x-2">
                        <a
                          href={`mailto:${sekretarisDesa.email}`}
                          className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors duration-300"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${sekretarisDesa.no_telepon}`}
                          className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Kepala Seksi */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2
                className="text-4xl font-bold text-gray-800 text-center mb-12"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Kepala Seksi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {kepalaSeksi.map((member, index) => (
                  <div
                    key={member.id_aparat}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover-lift"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    data-aos-duration="600"
                  >
                    {member.foto ? (
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${member.foto}`}
                          alt={member.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                          <span className="text-blue-700 font-semibold text-lg">
                            {member.nama
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                        {member.nama}
                      </h3>
                      <p className="text-emerald-600 font-semibold mb-3">
                        {member.jabatan}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        Periode: {member.periode_mulai} -{" "}
                        {member.periode_selesai}
                      </p>
                      <p className="text-gray-500 text-xs mb-4">
                        Status:{" "}
                        {member.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                      </p>
                      <div className="flex space-x-2">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors duration-300"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${member.no_telepon}`}
                          className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Kepala Urusan */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2
                className="text-4xl font-bold text-gray-800 text-center mb-12"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Kepala Urusan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {kepalaUrusan.map((member, index) => (
                  <div
                    key={member.id_aparat}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover-lift"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    data-aos-duration="600"
                  >
                    {member.foto ? (
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${member.foto}`}
                          alt={member.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-green-200 to-teal-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center">
                          <span className="text-green-700 font-semibold text-lg">
                            {member.nama
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                        {member.nama}
                      </h3>
                      <p className="text-emerald-600 font-semibold mb-3">
                        {member.jabatan}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        Periode: {member.periode_mulai} - {member.periode_selesai}
                      </p>
                      <p className="text-gray-500 text-xs mb-4">
                        Status: {member.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                      </p>
                      <div className="flex space-x-2">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors duration-300"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${member.no_telepon}`}
                          className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Staf Desa */}
          {stafDesa.length > 0 && (
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <h2
                  className="text-4xl font-bold text-gray-800 text-center mb-12"
                  data-aos="fade-up"
                  data-aos-duration="800"
                >
                  Staf Desa
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stafDesa.map((member, index) => (
                    <div
                      key={member.id_aparat}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100 text-center hover:shadow-lg transition-all duration-300 hover-lift"
                      data-aos="zoom-in"
                      data-aos-delay={index * 150}
                      data-aos-duration="700"
                    >
                      {member.foto ? (
                        <div className="w-24 h-24 relative rounded-full mx-auto mb-6 overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${member.foto}`}
                            alt={member.nama}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <span className="text-gray-700 font-semibold">
                            {member.nama
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {member.nama}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-3">
                        {member.jabatan}
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed mb-2">
                        Periode: {member.periode_mulai} - {member.periode_selesai}
                      </p>
                      <p className="text-gray-600 text-xs mb-4">
                        Status: {member.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                      </p>
                      <div className="flex justify-center space-x-2">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors duration-300"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${member.no_telepon}`}
                          className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Kepala Dusun */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2
                className="text-4xl font-bold text-gray-800 text-center mb-12"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Kepala Dusun
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {kepalaDusun.map((member, index) => (
                  <div
                    key={member.id_aparat}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-100 text-center hover:shadow-lg transition-all duration-300 hover-lift"
                    data-aos="zoom-in"
                    data-aos-delay={index * 150}
                    data-aos-duration="700"
                  >
                    {member.foto ? (
                      <div className="w-24 h-24 relative rounded-full mx-auto mb-6 overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${member.foto}`}
                          alt={member.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold">
                          {member.nama
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {member.nama}
                    </h3>
                    <p className="text-emerald-600 font-semibold mb-3">
                      {member.jabatan}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      Periode: {member.periode_mulai} - {member.periode_selesai}
                    </p>
                    <p className="text-gray-600 text-xs mb-4">
                      Status:{" "}
                      {member.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                    </p>
                    <div className="flex justify-center space-x-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors duration-300"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${member.no_telepon}`}
                        className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>{" "}
          {/* Organizational Chart */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2
                className="text-4xl font-bold text-gray-800 text-center mb-12"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Bagan Organisasi
              </h2>
              <div className="max-w-7xl mx-auto">
                <div
                  className="bg-gray-50 rounded-xl shadow-lg p-6 md:p-12"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="1000"
                >
                  {/* Mobile Layout - Vertical Stack */}
                  <div className="block lg:hidden">
                    <div className="flex flex-col items-center space-y-4">
                      {/* Kepala Desa */}
                      <div className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 w-full max-w-xs text-center">
                        <h3 className="font-bold text-yellow-800 text-sm">KEPALA DESA</h3>
                        <p className="text-xs text-yellow-700 mt-1">
                          {kepalaDesa?.nama || "Belum Ada Data"}
                        </p>
                      </div>

                      <div className="w-px h-6 bg-gray-400"></div>

                      {/* Sekretaris Desa */}
                      <div className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 w-full max-w-xs text-center">
                        <h3 className="font-bold text-yellow-800 text-sm">SEKRETARIS DESA</h3>
                        <p className="text-xs text-yellow-700 mt-1">
                          {sekretarisDesa?.nama || "Belum Ada Data"}
                        </p>
                      </div>

                      <div className="w-px h-6 bg-gray-400"></div>

                      {/* KASI Section */}
                      <div className="w-full max-w-xs space-y-3">
                        <h4 className="text-center font-bold text-gray-700 text-sm">KEPALA SEKSI</h4>
                        {["Kasi Pemerintahan", "Kasi Kesejahteraan", "Kasi Pelayanan"].map((jabatan) => {
                          const member = kepalaSeksi.find(m => m.jabatan === jabatan);
                          return (
                            <div key={jabatan} className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-3 text-center">
                              <h4 className="font-bold text-yellow-800 text-xs">{jabatan.toUpperCase()}</h4>
                              <p className="text-xs text-yellow-700 mt-1">
                                {member?.nama || "Belum Ada Data"}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* KAUR Section */}
                      <div className="w-full max-w-xs space-y-3">
                        <h4 className="text-center font-bold text-gray-700 text-sm">KEPALA URUSAN</h4>
                        {["Kaur Keuangan", "Kaur Perencanaan", "Kaur TU & Umum"].map((jabatan) => {
                          const member = kepalaUrusan.find(m => m.jabatan === jabatan);
                          return (
                            <div key={jabatan} className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-3 text-center">
                              <h4 className="font-bold text-yellow-800 text-xs">{jabatan.toUpperCase()}</h4>
                              <p className="text-xs text-yellow-700 mt-1">
                                {member?.nama || "Belum Ada Data"}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="w-px h-6 bg-gray-400"></div>

                      {/* KADUS Section */}
                      <div className="w-full max-w-xs space-y-3">
                        <h4 className="text-center font-bold text-gray-700 text-sm">KEPALA DUSUN</h4>
                        {["Kadus Suka Maju", "Kadus Beringin", "Kadus Bulp Parangga", "Kadus Laka", "Kadus Kampong Baru"].map((jabatan) => {
                          const member = kepalaDusun.find(m => m.jabatan === jabatan);
                          return (
                            <div key={jabatan} className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-3 text-center">
                              <h4 className="font-bold text-yellow-800 text-xs">{jabatan.toUpperCase()}</h4>
                              <p className="text-xs text-yellow-700 mt-1">
                                {member?.nama || "Belum Ada Data"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout - Sesuai Gambar */}
                  <div className="hidden lg:block">
                    <div className="relative max-w-6xl mx-auto">
                      {/* Kepala Desa - Paling Atas Tengah */}
                      <div className="flex justify-center mb-30">
                        <div className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-6 text-center min-w-[200px]">
                          <h3 className="font-bold text-yellow-800 text-lg">KEPALA DESA</h3>
                          <p className="text-sm text-yellow-700 mt-2">
                            {kepalaDesa?.nama || "Belum Ada Data"}
                          </p>
                        </div>
                      </div>

                      {/* Garis vertikal utama dari Kepala Desa */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-gray-600" style={{top: '120px', height: '825px'}}></div>

                      {/* Garis horizontal dari tengah ke Sekretaris */}
                      <div className="absolute left-1/2 h-px bg-gray-600" style={{top: '180px', width: '305px'}}></div>

                      {/* Garis vertikal ke bawah untuk Sekretaris */}
                      <div className="absolute w-px h-12 bg-gray-600" style={{top: '180px', right: '270px', height: '40px'}}></div>

                      {/* Garis vertikal ke bawah dari Sekretaris ke Kaur */}
                      <div className="absolute w-px h-12 bg-gray-600" style={{top: '320px', right: '270px', height: '80px'}}></div>

                      {/* Garis horizontal dari kepala desa ke kaur */}
                      <div className="absolute left-1/2 h-px bg-gray-600" style={{top: '360px', width: '305px'}}></div>

                      {/* Garis horizontal dari kepala desa ke kasi */}
                      <div className="absolute right-1/2 h-px bg-gray-600" style={{top: '360px', width: '305px'}}></div>

                      {/* Garis vertikal ke bawah dari kepala desa ke Kaur */}
                      <div className="absolute w-px h-12 bg-gray-600" style={{top: '360px', right: '880px', height: '40px'}}></div>

                      {/* lanjutan Garis vertikal utama dari Kepala Desa */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-gray-600" style={{top: '980px', height: '70px'}}></div>

                      {/* Garis horizontal dari kepala desa ke kadus */}
                      <div className="absolute left-1/2 h-px bg-gray-600" style={{top: '1030px', width: '390px'}}></div>
                      <div className="absolute right-1/2 h-px bg-gray-600" style={{top: '1030px', width: '390px'}}></div>

                      {/* Garis vertikal ke bawah dari kepala desa ke kadus */}
                      <div className="absolute w-px h-12 bg-gray-600" style={{top: '1030px', right: '965px', height: '20px'}}></div>
                      <div className="absolute w-px h-12 bg-gray-600" style={{top: '1030px', right: '765px', height: '20px'}}></div>
                      <div className="absolute w-px h-12 bg-gray-600" style={{top: '1030px', right: '386px', height: '20px'}}></div>
                      <div className="absolute w-px h-12 bg-gray-600" style={{top: '1030px', right: '186px', height: '20px'}}></div>

                      {/* Sekretaris Desa - Di kanan sedikit ke kiri */}
                      <div className="flex justify-end mb-24 pr-45">
                        <div className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 text-center min-w-[180px]">
                          <h3 className="font-bold text-yellow-800">SEKRETARIS DESA</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            {sekretarisDesa?.nama || "Belum Ada Data"}
                          </p>
                        </div>
                      </div>

                      {/* Level 3: KASI (kiri) dan KAUR (kanan) - Bersebelahan */}
                      <div className="grid grid-cols-2 gap-16 mb-8">
                        {/* KASI Section - Kiri */}
                        <div className="space-y-4">
                          <h4 className="text-center font-bold text-gray-700 text-lg mb-6">KEPALA SEKSI</h4>
                          <div className="space-y-3">
                            {["Kasi Pemerintahan", "Kasi Kesejahteraan", "Kasi Pelayanan"].map((jabatan) => {
                              const member = kepalaSeksi.find(m => m.jabatan === jabatan);
                              return (
                                <div key={jabatan} className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 text-center">
                                  <h4 className="font-bold text-yellow-800 text-sm">{jabatan.replace("Kasi ", "KASI ")}</h4>
                                  <p className="text-xs text-yellow-700 mt-1">
                                    {member?.nama || "Belum Ada Data"}
                                  </p>
                                  {/* Staf untuk setiap Kasi */}
                                  <div className="mt-3 pt-2 border-t border-yellow-300">
                                    <div className="bg-yellow-50 border border-yellow-400 rounded p-2">
                                      <h5 className="font-semibold text-yellow-800 text-xs">STAF {jabatan.replace("Kasi ", "KASI ")}</h5>
                                      <p className="text-xs text-yellow-600">
                                        {stafDesa.find(s => s.jabatan.includes(jabatan.replace("Kasi ", "Staf Kasi ")))?.nama || "Belum Ada Data"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* KAUR Section - Kanan */}
                        <div className="space-y-4">
                          <h4 className="text-center font-bold text-gray-700 text-lg mb-6">KEPALA URUSAN</h4>
                          <div className="space-y-3">
                            {["Kaur Keuangan", "Kaur Perencanaan", "Kaur TU & Umum"].map((jabatan) => {
                              const member = kepalaUrusan.find(m => m.jabatan === jabatan);
                              return (
                                <div key={jabatan} className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 text-center">
                                  <h4 className="font-bold text-yellow-800 text-sm">{jabatan.replace("Kaur ", "KAUR ")}</h4>
                                  <p className="text-xs text-yellow-700 mt-1">
                                    {member?.nama || "Belum Ada Data"}
                                  </p>
                                  {/* Staf untuk setiap Kaur */}
                                  <div className="mt-3 pt-2 border-t border-yellow-300">
                                    <div className="bg-yellow-50 border border-yellow-400 rounded p-2">
                                      <h5 className="font-semibold text-yellow-800 text-xs">STAF. {jabatan.replace("Kaur ", "")}</h5>
                                      <p className="text-xs text-yellow-600">
                                        {stafDesa.find(s => s.jabatan.includes(jabatan.replace("Kaur ", "Staf ")))?.nama || "Belum Ada Data"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Level 4: KADUS - Paling Bawah Tengah */}
                      <div className="flex justify-center">
                        <div className="max-w-5xl">
                          <h4 className="text-center font-bold text-gray-700 text-lg mb-20">KEPALA DUSUN</h4>
                          <div className="grid grid-cols-5 gap-3">
                            {["Kadus Suka Maju", "Kadus Beringin", "Kadus Bulp Parangga", "Kadus Laka", "Kadus Kampong Baru"].map((jabatan) => {
                              const member = kepalaDusun.find(m => m.jabatan === jabatan);
                              return (
                                <div key={jabatan} className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 text-center">
                                  <h4 className="font-bold text-yellow-800 text-xs">{jabatan.toUpperCase()}</h4>
                                  <p className="text-xs text-yellow-700 mt-1">
                                    {member?.nama || "Belum Ada Data"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
            </div>
          </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
