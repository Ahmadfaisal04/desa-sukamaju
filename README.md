# 🏡 Website Desa Sukamaju

**Desa Sukamaju** adalah website profil desa yang menampilkan informasi umum, berita terkini, dan galeri kegiatan masyarakat Desa Sukamaju, Kecamatan Karossa, Kabupaten Mamuju Tengah.  
Website ini dibuat menggunakan **Next.js** sebagai platform modern untuk membangun website yang cepat, responsif, dan mudah dikelola oleh perangkat desa.

🌐 **Demo Website:** [sukamaju.co.id](https://sukamaju.co.id)

---

## 🚀 Fitur Utama

- 📰 **Berita Desa (News Feed)**  
  Admin desa dapat mengunggah berita terkini seputar kegiatan dan informasi penting bagi masyarakat.

- 🏞️ **Galeri Kegiatan (Gallery)**  
  Menampilkan foto-foto kegiatan masyarakat dan dokumentasi pembangunan desa.

- 🧭 **Profil dan Info Desa**  
  Memuat informasi umum seperti lokasi desa, jumlah penduduk, jumlah dusun, RW, dan RT.

- 🧩 **Struktur Organisasi Pemerintah Desa**  
  Menampilkan bagan struktur perangkat desa secara interaktif.

- 📱 **Desain Responsif**  
  Website tampil optimal di berbagai perangkat, dari komputer hingga smartphone.

- ⚡ **Performa Cepat & SEO Friendly**  
  Menggunakan Next.js App Router untuk kecepatan tinggi dan optimasi mesin pencari (SEO).

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Deskripsi |
|------------|------------|
| [Next.js](https://nextjs.org/) | Framework React modern untuk frontend |
| [TypeScript](https://www.typescriptlang.org/) | Superset JavaScript untuk keamanan tipe data |
| [Tailwind CSS](https://tailwindcss.com/) | Styling cepat dan responsif |
| [Vercel](https://vercel.com/) | Platform hosting dan deployment |
| [Next Font (Geist)](https://vercel.com/font) | Font modern dari Vercel |

---

## 📦 Cara Menjalankan Proyek Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/username/desa-sukamaju.git
   cd desa-sukamaju
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. **Buka di browser:**
   ```
   http://localhost:3000
   ```

---

## 🧩 Struktur Folder

```
📦 desa-sukamaju
├── src/
│   ├── app/                      # Struktur halaman utama (App Router)
│   │   ├── admin/                # Halaman admin
│   │   ├── berita/               # Halaman berita desa
│   │   ├── galeri/               # Halaman galeri kegiatan
│   │   ├── struktur-organisasi/  # Halaman struktur organisasi
│   │   ├── tentang/              # Halaman tentang desa
│   │   ├── favicon.ico           # Ikon website
│   │   ├── globals.css           # File CSS global
│   │   ├── layout.tsx            # Layout utama
│   │   └── page.tsx              # Halaman utama (Home)
│   ├── components/               # Komponen UI (Navbar, Footer, Card, dll)
│   └── data/                     # Data statis (misalnya JSON profil desa, struktur organisasi, dll)
│
├── .env.local                    # Konfigurasi environment lokal
├── .gitignore                    # File untuk pengecualian Git
├── eslint.config.mjs             # Konfigurasi ESLint
├── next-env.d.ts                 # Deklarasi tipe Next.js
├── next.config.ts                # Konfigurasi Next.js
├── package.json                  # Dependensi proyek
├── package-lock.json             # Lock file npm
├── postcss.config.mjs            # Konfigurasi PostCSS
└── README.md                     # Dokumentasi proyek
```

---

## 👥 Kontributor

- **UI/UX Design:** Tim Website Desa Sukamaju  
- **Frontend Developer:** [Ahmad Faisal / Anggota Coconut Computer Club]
- **Backend Developer:** [Syahrul Ramadhan / Anggota Coconut Computer Club]  
- **Deployment:** Vercel  

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

> Website resmi untuk mendukung transparansi dan partisipasi masyarakat Desa Sukamaju  
> Dibuat dengan ❤️ oleh komunitas teknologi lokal dan Coconut Computer Club
