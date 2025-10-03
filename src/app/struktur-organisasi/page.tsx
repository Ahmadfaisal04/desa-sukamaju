import { organizationData } from "@/data/organization";
import { Mail, Phone } from "lucide-react";

export default function StrukturOrganisasi() {
  const kepalaDesa = organizationData.find(
    (member) => member.position === "Kepala Desa"
  );
  const perangkatDesa = organizationData.filter(
    (member) =>
      member.position !== "Kepala Desa" &&
      !member.position.includes("Kepala Dusun")
  );
  const kepalaDusun = organizationData.filter((member) =>
    member.position.includes("Kepala Dusun")
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Struktur Organisasi
            </h1>
            <p className="text-xl lg:text-2xl text-emerald-100 leading-relaxed">
              Mengenal para pemimpin dan perangkat desa yang mengabdi untuk
              kemajuan Desa Sejahtera
            </p>
          </div>
        </div>
      </section>

      {/* Kepala Desa */}
      {kepalaDesa && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-12">
                Kepala Desa
              </h2>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 max-w-2xl mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold text-lg">
                    Foto
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {kepalaDesa.name}
                </h3>
                <p className="text-lg text-emerald-600 font-semibold mb-4">
                  {kepalaDesa.position}
                </p>
                <p className="text-gray-700 leading-relaxed max-w-lg mx-auto">
                  {kepalaDesa.description}
                </p>
                <div className="flex justify-center space-x-4 mt-6">
                  <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                    <span>Telepon</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Perangkat Desa */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Perangkat Desa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {perangkatDesa.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                    <span className="text-blue-700 font-semibold">Foto</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-semibold mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.description}
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors duration-300">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kepala Dusun */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Kepala Dusun
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {kepalaDusun.map((member) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-100 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold">Foto</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-emerald-600 font-semibold mb-3">
                  {member.position}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {member.description}
                </p>
                <div className="flex justify-center space-x-2">
                  <button className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Chart */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Bagan Organisasi
          </h2>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Kepala Desa */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-emerald-100 border-2 border-emerald-500 rounded-lg p-4 max-w-xs">
                    <h3 className="font-bold text-emerald-700">Kepala Desa</h3>
                    <p className="text-sm text-emerald-600">
                      {kepalaDesa?.name}
                    </p>
                  </div>
                </div>

                {/* Connection Line */}
                <div className="flex justify-center mb-8">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>

                {/* Perangkat Desa */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {perangkatDesa.map((member) => (
                    <div key={member.id} className="text-center">
                      <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-3">
                        <h4 className="font-semibold text-blue-700 text-sm">
                          {member.position}
                        </h4>
                        <p className="text-xs text-blue-600">{member.name}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connection Line */}
                <div className="flex justify-center mb-8">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>

                {/* Kepala Dusun */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {kepalaDusun.map((member) => (
                    <div key={member.id} className="text-center">
                      <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-3">
                        <h4 className="font-semibold text-purple-700 text-sm">
                          {member.position}
                        </h4>
                        <p className="text-xs text-purple-600">{member.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </section>
    </div>
  );
}
