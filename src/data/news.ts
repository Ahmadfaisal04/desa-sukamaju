export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Pembangunan Jalan Desa Tahap II Dimulai",
    excerpt: "Proyek pembangunan jalan desa tahap kedua telah dimulai dengan target selesai pada akhir tahun.",
    content: "Proyek pembangunan jalan desa tahap kedua telah resmi dimulai pada minggu ini. Proyek yang didanai melalui Dana Desa ini akan menghubungkan wilayah utara dan selatan desa dengan akses yang lebih baik. Target penyelesaian adalah akhir tahun 2024.",
    image: "/placeholder-news-1.jpg",
    date: "2024-10-01",
    author: "Kepala Desa",
    category: "Pembangunan"
  },
  {
    id: "2",
    title: "Festival Budaya Desa 2024",
    excerpt: "Persiapan festival budaya tahunan telah memasuki tahap final dengan berbagai pertunjukan menarik.",
    content: "Festival Budaya Desa 2024 akan segera diselenggarakan dengan berbagai pertunjukan tradisional dan modern. Acara ini akan menampilkan tarian daerah, musik tradisional, dan pameran hasil karya warga desa.",
    image: "/placeholder-news-2.jpg",
    date: "2024-09-28",
    author: "Karang Taruna",
    category: "Budaya"
  },
  {
    id: "3",
    title: "Program Vaksinasi Massal di Balai Desa",
    excerpt: "Dinas Kesehatan akan mengadakan vaksinasi massal untuk seluruh warga desa secara gratis.",
    content: "Program vaksinasi massal akan dilaksanakan di Balai Desa selama tiga hari berturut-turut. Semua warga diharapkan dapat mengikuti program ini untuk menjaga kesehatan bersama.",
    image: "/placeholder-news-3.jpg",
    date: "2024-09-25",
    author: "Dinas Kesehatan",
    category: "Kesehatan"
  }
];