"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Save,
  Upload,
  Image as ImageIcon,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";



export default function AdminPengaturanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("umum");
  const [settings, setSettings] = useState({
    siteName: "Desa Sukamaju",
    contactEmail: "info@desasukamaju.id",
    contactPhone: "(021) 1234-5678",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    logoUrl: "/logo.png",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Admin data state
  const [adminData, setAdminData] = useState({
    id: "",
    username: "",
    nama: "",
    email: "",
    role: "",
  });
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const [adminDataError, setAdminDataError] = useState(false);
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    currentUsername: "",
    newUsername: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['umum', 'kontak', 'privacy'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch admin data on component mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  // Function to decode JWT token and get admin ID from claims
  // Function to logout and redirect to login page
  const handleLogout = () => {
    // Clear all tokens from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminAuth');
    
    // Redirect to login page
    router.push('/admin/login');
  };

  const getAdminIdFromToken = (token: string): string | null => {
    try {
      // JWT token has 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format');
        return null;
      }

      // Decode the payload (second part)
      const payload = parts[1];
      
      // Add padding if needed for base64 decoding
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      
      // Decode base64
      const decodedPayload = atob(paddedPayload);
      
      // Parse JSON
      const claims = JSON.parse(decodedPayload);
      
      // Return admin ID from claims (adjust the property name based on your JWT structure)
      return claims.id || claims.adminId || claims.admin_id || claims.sub || null;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };

  const fetchAdminData = async () => {
    try {
      setAdminDataError(false);
      // Get auth token from localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('Token not found');
        setAdminDataError(true);
        setIsLoadingAdmin(false);
        return;
      }

      // Get admin ID from JWT claims
      const adminId = getAdminIdFromToken(token);
      
      if (!adminId) {
        console.error('Admin ID not found in JWT token');
        setAdminDataError(true);
        setIsLoadingAdmin(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/${adminId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Assuming the API returns admin data in data.data
        const admin = data.data || data;
        
        setAdminData({
          id: admin.id || adminId,
          username: admin.username || "",
          nama: admin.nama || admin.name || "",
          email: admin.email || "",
          role: admin.role || "Admin",
        });
        
        // Update privacy settings with current username
        setPrivacySettings(prev => ({
          ...prev,
          currentUsername: admin.username || "",
        }));
      } else {
        console.error('Failed to fetch admin data:', response.statusText);
        setAdminDataError(true);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setAdminDataError(true);
    } finally {
      setIsLoadingAdmin(false);
    }
  };



  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePrivacyInputChange = (key: string, value: string) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordChange = async () => {
    if (privacySettings.newPassword !== privacySettings.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    if (privacySettings.newPassword.length < 6) {
      alert("Password baru minimal 6 karakter!");
      return;
    }
    if (!privacySettings.currentPassword.trim()) {
      alert("Password saat ini harus diisi!");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert("Sesi telah berakhir. Silakan login kembali.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/${adminData.username || privacySettings.currentUsername}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: privacySettings.currentPassword,
          password: privacySettings.newPassword,
          konfirmasi_password: privacySettings.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.code === 200) {
        alert(data.message || "Password berhasil diubah! Anda akan dialihkan ke halaman login.");
        // Clear password fields after successful update
        setPrivacySettings(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        
        // Logout after successful password change
        setTimeout(() => {
          handleLogout();
        }, 1000);
      } else {
        alert(data.message || "Gagal mengubah password. Silakan coba lagi.");
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert("Terjadi kesalahan saat mengubah password. Silakan coba lagi.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUsernameChange = async () => {
    if (!privacySettings.newUsername.trim()) {
      alert("Username baru tidak boleh kosong!");
      return;
    }
    if (privacySettings.newUsername.length < 3) {
      alert("Username minimal 3 karakter!");
      return;
    }

    setIsUpdatingUsername(true);
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert("Sesi telah berakhir. Silakan login kembali.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/${adminData.username || privacySettings.currentUsername}/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: privacySettings.newUsername
        }),
      });

      const data = await response.json();

      if (response.ok && data.code === 200) {
        alert(data.message || "Username berhasil diubah! Anda akan dialihkan ke halaman login.");
        
        // Update local state
        setPrivacySettings(prev => ({
          ...prev,
          currentUsername: prev.newUsername,
          newUsername: "",
        }));
        
        // Update admin data
        setAdminData(prev => ({
          ...prev,
          username: privacySettings.newUsername,
        }));
        
        // Logout after successful username change
        setTimeout(() => {
          handleLogout();
        }, 1000);
      } else {
        alert(data.message || "Gagal mengubah username. Silakan coba lagi.");
      }
    } catch (error) {
      console.error('Error updating username:', error);
      alert("Terjadi kesalahan saat mengubah username. Silakan coba lagi.");
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      handleInputChange("logoUrl", previewUrl);
    }
  };

  const handleSave = () => {
    // Simulate saving settings
    alert("Pengaturan berhasil disimpan!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pengaturan Website
            </h1>
            <p className="text-gray-600">
              Kelola konfigurasi dan pengaturan website Desa Sukamaju
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center space-x-2 bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <Save className="w-5 h-5" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Page Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              {activeTab === "umum" ? (
                <ImageIcon className="w-5 h-5 text-emerald-600" />
              ) : activeTab === "kontak" ? (
                <ImageIcon className="w-5 h-5 text-emerald-600" />
              ) : (
                <Shield className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === "umum" ? "Pengaturan Umum" : activeTab === "kontak" ? "Pengaturan Kontak" : "Pengaturan Privacy"}
              </h2>
              <p className="text-sm text-gray-500">
                {activeTab === "umum" 
                  ? "Kelola informasi dasar website Anda" 
                  : activeTab === "kontak"
                  ? "Kelola informasi kontak dan media sosial"
                  : "Kelola keamanan akun admin Anda"
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-8">{/* Umum Tab */}
              {activeTab === "umum" && (
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Nama Website */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-xl p-6 h-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Nama Website
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) =>
                            handleInputChange("siteName", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg font-medium"
                          placeholder="Masukkan nama website..."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Nama ini akan muncul di header dan title website
                        </p>
                      </div>
                    </div>

                    {/* Logo Website */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-xl p-6 h-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Logo Website
                        </label>
                        
                        {/* Logo Preview */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-100 flex items-center justify-center overflow-hidden">
                              <img 
                                src={settings.logoUrl} 
                                alt="Logo Preview" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.style.display = 'none';
                                  const nextSibling = target.nextElementSibling as HTMLElement;
                                  if (nextSibling) {
                                    nextSibling.classList.remove('hidden');
                                  }
                                }}
                              />
                              <ImageIcon className="w-8 h-8 text-emerald-400 hidden" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">Logo saat ini</p>
                              <p className="text-sm text-gray-500">
                                {logoFile ? logoFile.name : 'logo.png'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* File Upload */}
                        <div className="relative">
                          <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group"
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors duration-200">
                                <Upload className="w-6 h-6 text-emerald-600" />
                              </div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                Klik untuk memilih logo baru
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, atau SVG (maksimal 2MB)
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

          {/* Kontak Tab */}
          {activeTab === "kontak" && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Informasi Kontak */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Save className="w-4 h-4 text-blue-600" />
                  </div>
                  Informasi Kontak
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        handleInputChange("contactEmail", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="email@desasukamaju.id"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telepon
                    </label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) =>
                        handleInputChange("contactPhone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      placeholder="(021) 1234-5678"
                    />
                  </div>
                </div>
              </div>

              {/* Media Sosial */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  Media Sosial
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.facebookUrl}
                      onChange={(e) =>
                        handleInputChange("facebookUrl", e.target.value)
                      }
                      placeholder="https://facebook.com/desasukamaju"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagramUrl}
                      onChange={(e) =>
                        handleInputChange("instagramUrl", e.target.value)
                      }
                      placeholder="https://instagram.com/desasukamaju"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={settings.youtubeUrl}
                      onChange={(e) =>
                        handleInputChange("youtubeUrl", e.target.value)
                      }
                      placeholder="https://youtube.com/@desasukamaju"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Informasi Akun */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  Informasi Akun
                </h3>
                
                {/* Current Admin Info Display */}
                {isLoadingAdmin ? (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ) : adminDataError ? (
                  <div className="bg-white rounded-xl p-6 border border-red-200 mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="w-6 h-6 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Gagal Memuat Data Admin</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Tidak dapat mengambil informasi admin dari token JWT. Silakan login ulang atau coba lagi.
                      </p>
                      <button
                        onClick={fetchAdminData}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Informasi Admin Saat Ini
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Username</span>
                          <span className="font-mono text-gray-800">{adminData.username || 'Tidak tersedia'}</span>
                        </div>
                        <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded font-medium">
                          {adminData.role || 'Admin'}
                        </span>
                      </div>
                      {adminData.nama && (
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Nama Lengkap</span>
                            <span className="font-medium text-gray-800">{adminData.nama}</span>
                          </div>
                        </div>
                      )}
                      {adminData.email && (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Email</span>
                            <span className="font-medium text-gray-800">{adminData.email}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Change Username */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ubah Username
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Username Baru</label>
                      <input
                        type="text"
                        value={privacySettings.newUsername}
                        onChange={(e) => handlePrivacyInputChange("newUsername", e.target.value)}
                        placeholder="Masukkan username baru..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimal 3 karakter, hanya huruf, angka, dan underscore</p>
                    </div>
                    <button
                      onClick={handleUsernameChange}
                      disabled={!privacySettings.newUsername.trim() || isUpdatingUsername}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center"
                    >
                      {isUpdatingUsername && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      )}
                      {isUpdatingUsername ? 'Mengubah...' : 'Ubah Username'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Keamanan Password */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  Keamanan Password
                </h3>
                
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Ubah Password
                  </label>
                  
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Password Saat Ini</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={privacySettings.currentPassword}
                          onChange={(e) => handlePrivacyInputChange("currentPassword", e.target.value)}
                          placeholder="Masukkan password saat ini..."
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Password Baru</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={privacySettings.newPassword}
                          onChange={(e) => handlePrivacyInputChange("newPassword", e.target.value)}
                          placeholder="Masukkan password baru..."
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter untuk keamanan optimal</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={privacySettings.confirmPassword}
                          onChange={(e) => handlePrivacyInputChange("confirmPassword", e.target.value)}
                          placeholder="Konfirmasi password baru..."
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Password Match Indicator */}
                    {privacySettings.newPassword && privacySettings.confirmPassword && (
                      <div className={`p-3 rounded-lg text-sm ${
                        privacySettings.newPassword === privacySettings.confirmPassword 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}>
                        {privacySettings.newPassword === privacySettings.confirmPassword 
                          ? 'Password cocok' 
                          : 'Password tidak cocok'}
                      </div>
                    )}

                    <button
                      onClick={handlePasswordChange}
                      disabled={!privacySettings.currentPassword || !privacySettings.newPassword || !privacySettings.confirmPassword || isUpdatingPassword}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                    >
                      {isUpdatingPassword && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      )}
                      {isUpdatingPassword ? 'Mengubah Password...' : 'Ubah Password'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-gray-600" />
                  </div>
                  Tips Keamanan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Password Kuat</h4>
                    <p className="text-sm text-gray-600">Gunakan kombinasi huruf besar, kecil, angka, dan simbol minimal 8 karakter.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Update Berkala</h4>
                    <p className="text-sm text-gray-600">Ubah password secara berkala, minimal setiap 3-6 bulan sekali.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Jangan Berbagi</h4>
                    <p className="text-sm text-gray-600">Jangan pernah berbagi username dan password dengan orang lain.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Logout Aman</h4>
                    <p className="text-sm text-gray-600">Selalu logout setelah selesai menggunakan admin panel.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
