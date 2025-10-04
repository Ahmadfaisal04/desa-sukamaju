"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Save,
  Upload,
  Image as ImageIcon,
  MapPin,
  Target,
  Navigation,
} from "lucide-react";

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
  }
}

export default function AdminPengaturanPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("umum");
  const [settings, setSettings] = useState({
    siteName: "Desa Sukamaju",
    contactEmail: "info@desasukamaju.id",
    contactPhone: "(021) 1234-5678",
    address:
      "Jl. Raya Desa No. 123, Kecamatan Sukamaju, Kabupaten Makmur 12345",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d646.260079640575!2d119.3818133405465!3d-1.8336358952405705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d8d0b3807183ae9%3A0xb115727f48569d64!2sKantor%20Desa%20Suka%20Maju!5e1!3m2!1sid!2sid!4v1759500799882!5m2!1sid!2sid",
    latitude: -1.8336358952405705,
    longitude: 119.3818133405465,
    logoUrl: "/logo.png",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['umum', 'kontak'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        setIsMapLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsMapLoaded(true);
      };
      script.onerror = () => {
        console.warn('Failed to load Google Maps API');
      };
      document.head.appendChild(script);
    };

    if (activeTab === "kontak") {
      loadGoogleMapsAPI();
    }
  }, [activeTab]);

  // Initialize map when loaded
  useEffect(() => {
    if (isMapLoaded && mapRef.current && !mapInstanceRef.current && activeTab === "kontak") {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: settings.latitude, lng: settings.longitude },
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        const marker = new window.google.maps.Marker({
          position: { lat: settings.latitude, lng: settings.longitude },
          map: map,
          draggable: true,
          title: "Lokasi Kantor Desa",
        });

        // Listen for marker drag
        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          const lat = position.lat();
          const lng = position.lng();
          
          setSettings(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            mapsEmbedUrl: generateEmbedUrl(lat, lng)
          }));
        });

        // Listen for map click
        map.addListener("click", (event: any) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          marker.setPosition(event.latLng);
          setSettings(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            mapsEmbedUrl: generateEmbedUrl(lat, lng)
          }));
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    }
  }, [isMapLoaded, settings.latitude, settings.longitude, activeTab]);

  const generateEmbedUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${Math.abs(lat).toFixed(6)}!5e0!3m2!1sid!2sid!4v${Date.now()}!5m2!1sid!2sid`;
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Update map center and marker
          mapInstanceRef.current?.setCenter({ lat, lng });
          markerRef.current?.setPosition({ lat, lng });

          // Update settings
          setSettings(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            mapsEmbedUrl: generateEmbedUrl(lat, lng)
          }));
        },
        () => {
          alert("Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan.");
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser ini.");
    }
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
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
              ) : (
                <MapPin className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === "umum" ? "Pengaturan Umum" : "Pengaturan Kontak"}
              </h2>
              <p className="text-sm text-gray-500">
                {activeTab === "umum" 
                  ? "Kelola informasi dasar website Anda" 
                  : "Kelola informasi kontak, media sosial, dan lokasi kantor desa"
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
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alamat
                  </label>
                  <textarea
                    value={settings.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Masukkan alamat lengkap desa..."
                  />
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

              {/* Google Maps Lokasi Kantor Desa */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  Lokasi Kantor Desa
                </h3>
                
                <div className="space-y-6">
                  {/* Info dan Instruksi */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Navigation className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900 mb-2">🗺️ Pilih Lokasi Kantor Desa</p>
                          <p className="mb-2">
                            Gunakan peta interaktif di bawah untuk memilih lokasi kantor desa dengan mudah:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>🎯 Klik langsung di peta untuk menandai lokasi</li>
                            <li> Gunakan lokasi GPS saat ini</li>
                            <li>🖱️ Seret marker untuk posisi yang tepat</li>
                            <li>🔄 URL iframe otomatis ter-generate</li>
                          </ul>
                          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                              <p className="text-yellow-800 text-xs">
                                <strong>⚠️ API Key Required:</strong> Tambahkan <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> ke file .env.local untuk mengaktifkan fitur interaktif.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Map Container */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        🗺️ Peta Interaktif
                      </label>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={!isMapLoaded}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center text-sm"
                        title="Gunakan lokasi saat ini"
                      >
                        <Target className="w-4 h-4 mr-1" />
                        Lokasi Saya
                      </button>
                    </div>
                    
                    {/* Map Container */}
                    <div 
                      ref={mapRef}
                      className="w-full h-96 bg-gray-100 rounded-xl border border-gray-300 flex items-center justify-center overflow-hidden"
                    >
                      {!isMapLoaded && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                          <p className="text-gray-600">
                            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 
                              'Memuat Google Maps...' : 
                              'Memerlukan Google Maps API Key'
                            }
                          </p>
                          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                            <p className="text-xs text-red-600 mt-2">
                              Setup API key untuk mengaktifkan fitur ini
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Coordinates Display */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      📍 Koordinat Lokasi
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                        <input
                          type="number"
                          value={settings.latitude}
                          onChange={(e) => {
                            const lat = parseFloat(e.target.value);
                            if (!isNaN(lat)) {
                              setSettings(prev => ({ 
                                ...prev, 
                                latitude: lat,
                                mapsEmbedUrl: generateEmbedUrl(lat, prev.longitude)
                              }));
                              if (markerRef.current && mapInstanceRef.current) {
                                const newPos = { lat, lng: settings.longitude };
                                markerRef.current.setPosition(newPos);
                                mapInstanceRef.current.setCenter(newPos);
                              }
                            }
                          }}
                          step="0.000001"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                        <input
                          type="number"
                          value={settings.longitude}
                          onChange={(e) => {
                            const lng = parseFloat(e.target.value);
                            if (!isNaN(lng)) {
                              setSettings(prev => ({ 
                                ...prev, 
                                longitude: lng,
                                mapsEmbedUrl: generateEmbedUrl(prev.latitude, lng)
                              }));
                              if (markerRef.current && mapInstanceRef.current) {
                                const newPos = { lat: settings.latitude, lng };
                                markerRef.current.setPosition(newPos);
                                mapInstanceRef.current.setCenter(newPos);
                              }
                            }
                          }}
                          step="0.000001"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Generated Embed URL */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🔗 URL Iframe Google Maps (Auto Generated)
                    </label>
                    <div className="space-y-3">
                      <textarea
                        value={settings.mapsEmbedUrl}
                        onChange={(e) => handleInputChange("mapsEmbedUrl", e.target.value)}
                        placeholder="URL iframe akan dibuat otomatis saat Anda memilih lokasi di peta..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm font-mono"
                      />
                      <p className="text-xs text-gray-600">
                        💡 URL ini akan digunakan untuk menampilkan peta di halaman "Tentang Desa"
                      </p>
                    </div>
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
