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

        if (result.code === 200 && result.data) {
          setAparatData(result.data);
        } else {
          setError("Gagal mengambil data aparat");
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
  const perangkatDesa = aparatData.filter(
    (member) =>
      member.jabatan !== "Kepala Desa" &&
      !member.jabatan.includes("Kepala Dusun")
  );
  const kepalaDusun = aparatData.filter((member) =>
    member.jabatan.includes("Kepala Dusun")
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
          </section>{" "}
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
          {/* Perangkat Desa */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2
                className="text-4xl font-bold text-gray-800 text-center mb-12"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Perangkat Desa
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {perangkatDesa.map((member, index) => (
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
          </section>{" "}
          {/* Kepala Dusun */}
          <section className="py-16 bg-white">
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
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2
                className="text-4xl font-bold text-gray-800 text-center mb-12"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Bagan Organisasi
              </h2>
              <div className="max-w-6xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-lg p-4 md:p-8 hover-glow"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="1000"
                >
                  {/* Mobile Layout - Vertical Stack */}
                  <div className="block md:hidden">
                    <div className="flex flex-col items-center space-y-4">
                      {" "}
                      {/* Kepala Desa */}
                      <div
                        className="bg-emerald-100 border-2 border-emerald-500 rounded-lg p-4 w-full max-w-xs text-center hover-scale"
                        data-aos="fade-down"
                        data-aos-delay="100"
                      >
                        <h3 className="font-bold text-emerald-700">
                          Kepala Desa
                        </h3>
                        <p className="text-sm text-emerald-600">
                          {kepalaDesa?.nama}
                        </p>
                      </div>
                      {/* Connection Line */}
                      <div
                        className="w-px h-6 bg-gray-300"
                        data-aos="fade-in"
                        data-aos-delay="200"
                      ></div>
                      {/* Sekretaris Desa */}
                      {(() => {
                        const sekretaris = perangkatDesa.find(
                          (member) => member.jabatan === "Sekretaris"
                        );
                        return sekretaris ? (
                          <div
                            className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 w-full max-w-xs text-center hover-scale"
                            data-aos="fade-up"
                            data-aos-delay="300"
                          >
                            <h4 className="font-semibold text-blue-700">
                              {sekretaris.jabatan}
                            </h4>
                            <p className="text-sm text-blue-600">
                              {sekretaris.nama}
                            </p>
                          </div>
                        ) : null;
                      })()}
                      {/* Connection Line */}
                      <div className="w-px h-6 bg-gray-300"></div>{" "}
                      {/* Kepala Urusan - Vertical */}
                      <div
                        className="space-y-3 w-full max-w-xs"
                        data-aos="fade-up"
                        data-aos-delay="500"
                      >
                        {perangkatDesa
                          .filter((member) =>
                            member.jabatan.includes("Kepala Urusan")
                          )
                          .map((member, index) => (
                            <div
                              key={member.id_aparat}
                              className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 text-center hover-scale"
                              data-aos="zoom-in"
                              data-aos-delay={600 + index * 100}
                            >
                              <h4 className="font-semibold text-blue-700 text-sm">
                                {member.jabatan}
                              </h4>
                              <p className="text-sm text-blue-600">
                                {member.nama}
                              </p>
                            </div>
                          ))}
                      </div>
                      {/* Connection Line */}
                      <div className="w-px h-6 bg-gray-300"></div>{" "}
                      {/* Kepala Dusun - Vertical */}
                      <div
                        className="space-y-3 w-full max-w-xs"
                        data-aos="fade-up"
                        data-aos-delay="800"
                      >
                        {kepalaDusun.map((member, index) => (
                          <div
                            key={member.id_aparat}
                            className="bg-purple-100 border-2 border-purple-500 rounded-lg p-4 text-center hover-scale"
                            data-aos="slide-up"
                            data-aos-delay={900 + index * 100}
                          >
                            <h4 className="font-semibold text-purple-700 text-sm">
                              {member.jabatan}
                            </h4>
                            <p className="text-sm text-purple-600">
                              {member.nama}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout - Horizontal with scroll */}
                  <div className="hidden md:block overflow-x-auto">
                    <div className="min-w-[800px]">
                      {/* Kepala Desa */}
                      <div className="text-center mb-8">
                        <div className="inline-block bg-emerald-100 border-2 border-emerald-500 rounded-lg p-4 max-w-xs">
                          <h3 className="font-bold text-emerald-700">
                            Kepala Desa
                          </h3>
                          <p className="text-sm text-emerald-600">
                            {kepalaDesa?.nama}
                          </p>
                        </div>
                      </div>

                      {/* Connection Line */}
                      <div className="flex justify-center mb-8">
                        <div className="w-px h-8 bg-gray-300"></div>
                      </div>

                      {/* Perangkat Desa */}
                      <div className="grid grid-cols-4 gap-4 mb-8">
                        {perangkatDesa.map((member) => (
                          <div key={member.id_aparat} className="text-center">
                            <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-3">
                              <h4 className="font-semibold text-blue-700 text-sm">
                                {member.jabatan}
                              </h4>
                              <p className="text-xs text-blue-600">
                                {member.nama}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Connection Line */}
                      <div className="flex justify-center mb-8">
                        <div className="w-px h-8 bg-gray-300"></div>
                      </div>

                      {/* Kepala Dusun */}
                      <div className="grid grid-cols-3 gap-4">
                        {kepalaDusun.map((member) => (
                          <div key={member.id_aparat} className="text-center">
                            <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-3">
                              <h4 className="font-semibold text-purple-700 text-sm">
                                {member.jabatan}
                              </h4>
                              <p className="text-xs text-purple-600">
                                {member.nama}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
