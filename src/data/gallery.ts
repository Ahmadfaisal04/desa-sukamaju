export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  description: string;
  category: string;
  date: string;
}

export const galleryData: GalleryItem[] = [
  {
    id: "1",
    title: "Upacara Kemerdekaan RI ke-79",
    image: "/placeholder-gallery-1.jpg",
    description: "Perayaan kemerdekaan Indonesia yang meriah di lapangan desa",
    category: "Acara",
    date: "2024-08-17"
  },
  {
    id: "2",
    title: "Gotong Royong Membersihkan Desa",
    image: "/placeholder-gallery-2.jpg",
    description: "Kegiatan gotong royong rutin setiap bulan untuk menjaga kebersihan desa",
    category: "Kegiatan",
    date: "2024-09-15"
  },
  {
    id: "3",
    title: "Pemandangan Sawah Desa",
    image: "/placeholder-gallery-3.jpg",
    description: "Hamparan sawah hijau yang menjadi kebanggaan desa",
    category: "Alam",
    date: "2024-09-20"
  },
  {
    id: "4",
    title: "Pasar Tradisional Desa",
    image: "/placeholder-gallery-4.jpg",
    description: "Suasana pasar tradisional yang ramai di pagi hari",
    category: "Ekonomi",
    date: "2024-09-22"
  },
  {
    id: "5",
    title: "Masjid Desa",
    image: "/placeholder-gallery-5.jpg",
    description: "Masjid utama desa yang menjadi pusat kegiatan keagamaan",
    category: "Religi",
    date: "2024-09-10"
  },
  {
    id: "6",
    title: "Balai Desa",
    image: "/placeholder-gallery-6.jpg",
    description: "Balai desa yang digunakan untuk berbagai kegiatan resmi",
    category: "Fasilitas",
    date: "2024-09-05"
  }
];