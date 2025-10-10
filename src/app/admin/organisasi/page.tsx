"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  MoreVertical,
  Users,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  X,
  Upload,
} from "lucide-react";

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

export default function AdminOrganisasiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("Semua");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [aparatData, setAparatData] = useState<AparatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    nama: "",
    jabatan: "",
    no_telepon: "",
    email: "",
    status: "aktif",
    periode_mulai: "",
    periode_selesai: "",
    nama_dusun: "",
    foto: null as File | null,
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const fetchAparatData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aparat`);
        const result = await response.json();
        
        if (result.code === 200 && result.data) {
          setAparatData(result.data);
        } else {
          setError('Gagal mengambil data aparat');
        }
      } catch (error) {
        console.error('Error fetching aparat data:', error);
        setError('Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchAparatData();
  }, []);

  // Function to refresh data after adding new member
  const refreshData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aparat`);
      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        setAparatData(result.data);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Handle add form submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const formData = new FormData();
      formData.append('nama', addFormData.nama);
      formData.append('jabatan', addFormData.jabatan);
      formData.append('no_telepon', addFormData.no_telepon);
      formData.append('email', addFormData.email);
      formData.append('status', addFormData.status);
      formData.append('periode_mulai', addFormData.periode_mulai);
      formData.append('periode_selesai', addFormData.periode_selesai);
      
      // Tambahkan nama_dusun jika jabatan adalah Kepala Dusun
      if (addFormData.jabatan === 'Kepala Dusun' && addFormData.nama_dusun) {
        formData.append('nama_dusun', addFormData.nama_dusun);
      }
      
      if (addFormData.foto) {
        formData.append('foto', addFormData.foto);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aparat`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.code === 200) {
        // Reset form
        setAddFormData({
          nama: "",
          jabatan: "",
          no_telepon: "",
          email: "",
          status: "aktif",
          periode_mulai: "",
          periode_selesai: "",
          nama_dusun: "",
          foto: null,
        });
        
        // Close modal
        setShowAddModal(false);
        
        // Refresh data
        await refreshData();
        
        alert('Anggota berhasil ditambahkan!');
      } else {
        alert(result.message || 'Gagal menambahkan anggota');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Terjadi kesalahan saat menambahkan anggota');
    } finally {
      setAddLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddFormData(prev => ({ ...prev, foto: file }));
    }
  };

  const positions = [
    "Semua",
    "Kepala Desa",
    "Wakil Kepala Desa",
    "Sekretaris",
    "Bendahara",
    "Kepala Urusan",
    "Kepala Dusun",
    "Staf",
  ];

  const filteredMembers = aparatData.filter((member) => {
    const matchesSearch =
      member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition =
      filterPosition === "Semua" || member.jabatan === filterPosition;
    return matchesSearch && matchesPosition;
  });

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMembers(
      selectedMembers.length === filteredMembers.length
        ? []
        : filteredMembers.map((member) => member.id_aparat)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-2 text-gray-600">Memuat data aparat...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Kelola Struktur Organisasi
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data anggota dan struktur organisasi Desa Sukamaju
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-sm"
        >
          <UserPlus className="w-5 h-5" />
          <span>Tambah Anggota</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Anggota
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : aparatData.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {positions.slice(1, 4).map((position, index) => {
          const count = aparatData.filter(
            (member) => member.jabatan === position
          ).length;
          const colors = [
            { bg: "bg-blue-100", text: "text-blue-600" },
            { bg: "bg-purple-100", text: "text-purple-600" },
            { bg: "bg-orange-100", text: "text-orange-600" },
          ];
          const color = colors[index] || colors[0];

          return (
            <div
              key={position}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {position}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? "..." : count}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center`}
                >
                  <User className={`w-6 h-6 ${color.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari anggota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Position Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedMembers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedMembers.length} dipilih
                </span>
                <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
                  Hapus Terpilih
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedMembers.length === filteredMembers.length &&
                      filteredMembers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anggota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jabatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id_aparat} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id_aparat)}
                      onChange={() => handleSelectMember(member.id_aparat)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {member.foto ? (
                        <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${member.foto}`}
                            alt={member.nama}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-700 font-semibold text-sm">
                            {member.nama
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {member.nama}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Periode: {member.periode_mulai} - {member.periode_selesai}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium text-gray-900">
                        {member.jabatan}
                      </span>
                      <p className="text-sm text-gray-500">
                        Status: {member.status}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{member.no_telepon || "-"}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{member.email || "-"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'aktif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/organisasi/edit/${member.id_aparat}`}
                        className="p-2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada anggota ditemukan
            </h3>
            <p className="text-gray-500 mb-4">
              Coba ubah filter atau kata kunci pencarian
            </p>
            <Link
              href="/admin/organisasi/tambah"
              className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Anggota Pertama</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {filteredMembers.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Menampilkan {filteredMembers.length} dari{" "}
                {aparatData.length} anggota
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Sebelumnya
                </button>
                <button className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tambah Anggota Baru</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama */}
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="nama"
                    required
                    value={addFormData.nama}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Jabatan */}
                <div>
                  <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 mb-2">
                    Jabatan *
                  </label>
                  <select
                    id="jabatan"
                    required
                    value={addFormData.jabatan}
                    onChange={(e) => {
                      setAddFormData(prev => ({ 
                        ...prev, 
                        jabatan: e.target.value,
                        nama_dusun: e.target.value !== 'Kepala Dusun' ? '' : prev.nama_dusun
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Pilih Jabatan</option>
                    <option value="Kepala Desa">Kepala Desa</option>
                    <option value="Wakil Kepala Desa">Wakil Kepala Desa</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                    <option value="Kepala Urusan">Kepala Urusan</option>
                    <option value="Kepala Dusun">Kepala Dusun</option>
                    <option value="Staf">Staf</option>
                  </select>
                </div>

                {/* Nama Dusun - Conditional */}
                {addFormData.jabatan === 'Kepala Dusun' && (
                  <div>
                    <label htmlFor="nama_dusun" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Dusun *
                    </label>
                    <select
                      id="nama_dusun"
                      required
                      value={addFormData.nama_dusun}
                      onChange={(e) => setAddFormData(prev => ({ ...prev, nama_dusun: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Pilih Dusun</option>
                      <option value="Dusun Makmur">Dusun Makmur</option>
                      <option value="Dusun Sejahtera">Dusun Sejahtera</option>
                      <option value="Dusun Bahagia">Dusun Bahagia</option>
                      <option value="Dusun Maju">Dusun Maju</option>
                      <option value="Dusun Sentosa">Dusun Sentosa</option>
                      <option value="Dusun Harmoni">Dusun Harmoni</option>
                    </select>
                  </div>
                )}

                {/* No Telepon */}
                <div>
                  <label htmlFor="no_telepon" className="block text-sm font-medium text-gray-700 mb-2">
                    No. Telepon *
                  </label>
                  <input
                    type="tel"
                    id="no_telepon"
                    required
                    value={addFormData.no_telepon}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, no_telepon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={addFormData.email}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="nama@sukamaju.co.id"
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    required
                    value={addFormData.status}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="tidak aktif">Tidak Aktif</option>
                  </select>
                </div>

                {/* Periode Mulai */}
                <div>
                  <label htmlFor="periode_mulai" className="block text-sm font-medium text-gray-700 mb-2">
                    Periode Mulai *
                  </label>
                  <input
                    type="number"
                    id="periode_mulai"
                    required
                    min="1900"
                    max="2100"
                    value={addFormData.periode_mulai}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, periode_mulai: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="2023"
                  />
                </div>

                {/* Periode Selesai */}
                <div>
                  <label htmlFor="periode_selesai" className="block text-sm font-medium text-gray-700 mb-2">
                    Periode Selesai *
                  </label>
                  <input
                    type="number"
                    id="periode_selesai"
                    required
                    min="1900"
                    max="2100"
                    value={addFormData.periode_selesai}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, periode_selesai: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="2029"
                  />
                </div>
              </div>

              {/* Foto */}
              <div>
                <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Profil
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors duration-200">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Klik untuk upload foto atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Format: JPG, PNG, GIF (Max: 5MB)
                  </p>
                  <input
                    type="file"
                    id="foto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="foto"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih File
                  </label>
                  {addFormData.foto && (
                    <p className="text-sm text-emerald-600 mt-2">
                      File terpilih: {addFormData.foto.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {addLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{addLoading ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
