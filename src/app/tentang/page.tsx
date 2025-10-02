import { MapPin, Users, Building, Calendar, Award, TreePine, Wheat, School } from "lucide-react";

export default function TentangDesa() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Tentang Desa Sukamaju
            </h1>
            <p className="text-xl lg:text-2xl text-emerald-100 leading-relaxed">
              Mengenal lebih dekat sejarah, visi misi, dan potensi desa yang kaya akan budaya dan tradisi
            </p>
          </div>
        </div>
      </section>

      {/* Profile Desa */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Profil Desa</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Desa Sukamaju merupakan salah satu desa di Kecamatan Karossa, Kabupaten Mamuju Tengah yang 
                memiliki potensi besar dalam bidang pertanian, pariwisata, dan pengembangan masyarakat. 
                Dengan luas wilayah sekitar 15,5 km² dan jumlah penduduk 5.432 jiwa, desa ini terus 
                berkembang menjadi desa mandiri dan sejahtera.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Letak geografis yang strategis dan didukung oleh sumber daya alam yang melimpah, 
                membuat Desa Sukamaju memiliki prospek yang cerah untuk menjadi desa percontohan 
                dalam pembangunan berkelanjutan.
              </p>
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

      {/* Data Wilayah */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Data Wilayah</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-2">15,5 km²</h3>
              <p className="text-gray-600">Luas Wilayah</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">5.432</h3>
              <p className="text-gray-600">Jumlah Penduduk</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">1.654</h3>
              <p className="text-gray-600">Kepala Keluarga</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">1987</h3>
              <p className="text-gray-600">Tahun Berdiri</p>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Batas Wilayah</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Utara:</h4>
                <p className="text-gray-600">Desa Makmur</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Selatan:</h4>
                <p className="text-gray-600">Desa Bahagia</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Timur:</h4>
                <p className="text-gray-600">Desa Maju</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Barat:</h4>
                <p className="text-gray-600">Desa Sentosa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Visi & Misi</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100">
                <div className="w-16 h-16 bg-emerald-600 rounded-full mb-6 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-600 mb-4">Visi</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Terwujudnya Desa Sukamaju yang maju, mandiri, dan sejahtera berdasarkan gotong royong dan kearifan lokal"
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
                <div className="w-16 h-16 bg-blue-600 rounded-full mb-6 flex items-center justify-center">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Misi</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Meningkatkan kualitas pelayanan publik yang prima</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Mengembangkan potensi ekonomi desa berbasis kearifan lokal</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Memperkuat persatuan dan kesatuan masyarakat</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Melestarikan budaya dan tradisi lokal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Potensi Desa */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Potensi Desa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Wheat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Pertanian</h3>
              <p className="text-gray-600 text-center">
                Lahan pertanian seluas 8.5 km² dengan hasil padi, jagung, dan sayuran berkualitas tinggi
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <TreePine className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Kehutanan</h3>
              <p className="text-gray-600 text-center">
                Hutan konservasi seluas 3.2 km² sebagai paru-paru desa dan sumber mata air
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Pariwisata</h3>
              <p className="text-gray-600 text-center">
                Objek wisata alam dan budaya yang menarik wisatawan lokal dan mancanegara
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <School className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Pendidikan</h3>
              <p className="text-gray-600 text-center">
                Fasilitas pendidikan lengkap dari TK hingga SMA dengan kualitas terbaik
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Singkat */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Sejarah Singkat</h2>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Desa Sukamaju didirikan pada tahun 1987 sebagai hasil pemekaran dari desa induk yang lebih besar. 
                Nama "Sukamaju" dipilih dengan harapan bahwa desa ini akan menjadi tempat yang memberikan 
                kesejahteraan bagi seluruh warganya.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Pada awal berdirinya, desa ini masih berupa perkampungan kecil dengan mata pencaharian utama 
                bertani dan berkebun. Seiring berjalannya waktu, dengan semangat gotong royong yang tinggi, 
                masyarakat berhasil membangun berbagai fasilitas umum seperti jalan, jembatan, masjid, dan sekolah.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Kini, setelah lebih dari 35 tahun berkembang, Desa Sukamaju telah menjadi salah satu desa 
                percontohan di kabupaten dengan berbagai prestasi dan inovasi dalam pembangunan desa yang berkelanjutan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}