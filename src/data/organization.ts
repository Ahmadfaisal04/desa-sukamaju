export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  image: string;
  description?: string;
}

export const organizationData: OrganizationMember[] = [
  {
    id: "1",
    name: "Bapak Ahmad Suryanto",
    position: "Kepala Desa",
    image: "/placeholder-person-1.jpg",
    description: "Memimpin pemerintahan desa dan bertanggung jawab atas kesejahteraan masyarakat"
  },
  {
    id: "2",
    name: "Ibu Siti Nurhaliza",
    position: "Sekretaris Desa",
    image: "/placeholder-person-2.jpg",
    description: "Mengelola administrasi dan dokumentasi pemerintahan desa"
  },
  {
    id: "3",
    name: "Bapak Bambang Wijaya",
    position: "Kepala Urusan Keuangan",
    image: "/placeholder-person-3.jpg",
    description: "Mengelola keuangan desa dan pelaporan anggaran"
  },
  {
    id: "4",
    name: "Bapak Doni Setiawan",
    position: "Kepala Urusan Perencanaan",
    image: "/placeholder-person-4.jpg",
    description: "Merencanakan program pembangunan dan pengembangan desa"
  },
  {
    id: "5",
    name: "Ibu Maya Sari",
    position: "Kepala Urusan Umum",
    image: "/placeholder-person-5.jpg",
    description: "Mengatur keperluan umum dan pelayanan masyarakat"
  },
  {
    id: "6",
    name: "Bapak Eko Prasetyo",
    position: "Kepala Dusun 1",
    image: "/placeholder-person-6.jpg",
    description: "Memimpin dan mengkoordinasi kegiatan di Dusun 1"
  },
  {
    id: "7",
    name: "Bapak Rudi Hartono",
    position: "Kepala Dusun 2",
    image: "/placeholder-person-7.jpg",
    description: "Memimpin dan mengkoordinasi kegiatan di Dusun 2"
  },
  {
    id: "8",
    name: "Bapak Agus Salim",
    position: "Kepala Dusun 3",
    image: "/placeholder-person-8.jpg",
    description: "Memimpin dan mengkoordinasi kegiatan di Dusun 3"
  }
];