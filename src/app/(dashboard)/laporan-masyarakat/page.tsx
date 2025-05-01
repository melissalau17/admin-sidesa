"use client"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UbahStatusLaporanModal } from "../../../components/modals/ubah-status-laporan"
import { LihatLaporanModal } from "@/components/modals/lihat-laporan-modal"

interface LaporanItem {
   id: number
   nama: string
   judul: string
   kategori: string
   tanggal: string
   status: string
   isi: string
   lokasi?: string
   kontak?: string
   gambar?: string
}

const initialLaporanData: LaporanItem[] = [
   {
      id: 1,
      nama: "Agus Setiawan",
      judul: "Jalan Rusak di RT 03",
      kategori: "Infrastruktur",
      tanggal: "11 Mar 2025",
      status: "Diproses",
      isi: "Jalan di RT 03 RW 02 rusak parah dan berlubang. Sudah beberapa kali motor warga terjatuh karena lubang tersebut, terutama saat malam hari karena penerangan jalan yang kurang memadai.\n\nMohon agar segera diperbaiki untuk menghindari kecelakaan yang lebih parah.",
      lokasi: "Jl. Mawar RT 03 RW 02",
      kontak: "081234567890",
      gambar: "/placeholder.svg?height=300&width=500",
   },
   {
      id: 2,
      nama: "Rina Wati",
      judul: "Lampu Jalan Mati di Perempatan",
      kategori: "Infrastruktur",
      tanggal: "9 Mar 2025",
      status: "Diproses",
      isi: "Lampu jalan di perempatan Jl. Melati dan Jl. Anggrek mati sejak 3 hari yang lalu. Kondisi malam hari menjadi sangat gelap dan membahayakan pengguna jalan.\n\nMohon segera diperbaiki untuk keamanan warga yang melintas di malam hari.",
      lokasi: "Perempatan Jl. Melati dan Jl. Anggrek",
      kontak: "081234567891",
      gambar: "/placeholder.svg?height=300&width=500",
   },
   {
      id: 3,
      nama: "Hendra Gunawan",
      judul: "Sampah Menumpuk di Pasar",
      kategori: "Lingkungan",
      tanggal: "7 Mar 2025",
      status: "Selesai",
      isi: "Terjadi penumpukan sampah di area belakang pasar desa yang menimbulkan bau tidak sedap dan berpotensi menjadi sarang penyakit. Sampah sudah menumpuk selama seminggu dan belum diangkut.\n\nMohon agar petugas kebersihan segera mengangkut sampah tersebut dan menjadwalkan pengangkutan sampah secara rutin.",
      lokasi: "Pasar Desa, belakang blok B",
      kontak: "081234567892",
      gambar: "/placeholder.svg?height=300&width=500",
   },
   {
      id: 4,
      nama: "Sri Wahyuni",
      judul: "Kegiatan Mencurigakan di Rumah Kosong",
      kategori: "Keamanan",
      tanggal: "5 Mar 2025",
      status: "Diproses",
      isi: "Saya ingin melaporkan adanya kegiatan mencurigakan di rumah kosong di Jl. Dahlia No. 15. Beberapa hari terakhir terlihat orang-orang yang tidak dikenal keluar masuk rumah tersebut pada malam hari.\n\nMohon agar petugas keamanan desa dapat melakukan patroli dan pengecekan untuk memastikan tidak ada kegiatan ilegal yang dilakukan.",
      lokasi: "Jl. Dahlia No. 15",
      kontak: "081234567893",
   },
   {
      id: 5,
      nama: "Dedi Kurniawan",
      judul: "Saluran Air Tersumbat",
      kategori: "Lingkungan",
      tanggal: "2 Mar 2025",
      status: "Selesai",
      isi: "Saluran air di depan rumah saya tersumbat dan menyebabkan genangan air saat hujan. Kondisi ini sudah berlangsung selama dua minggu dan semakin parah.\n\nMohon agar segera dibersihkan untuk mencegah banjir saat musim hujan.",
      lokasi: "Jl. Kenanga RT 05 RW 03 No. 7",
      kontak: "081234567894",
      gambar: "/placeholder.svg?height=300&width=500",
   },
]

const getStatusColor = (status: string): string => {
   switch (status) {
      case "Diproses":
         return "bg-blue-100 text-blue-800"
      case "Selesai":
         return "bg-green-100 text-green-800"
      case "Ditolak":
         return "bg-gray-100 text-gray-800"
      default:
         return "bg-gray-100 text-gray-800"
   }
}

export default function LaporanMasyarakatPage() {
   const [laporanData, setLaporanData] = useState<LaporanItem[]>(initialLaporanData)
   const [searchQuery, setSearchQuery] = useState<string>("")

   // Function to update the status of a laporan
   const handleStatusChange = (id: number, newStatus: string) => {
      setLaporanData((prevData) =>
         prevData.map((laporan) => (laporan.id === id ? { ...laporan, status: newStatus } : laporan)),
      )
   }

   // Function to handle search input changes
   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
   }

   // Filter data based on search query
   const filteredData = laporanData.filter((laporan) => {
      const query = searchQuery.toLowerCase()
      return (
         laporan.nama.toLowerCase().includes(query) ||
         laporan.judul.toLowerCase().includes(query) ||
         laporan.kategori.toLowerCase().includes(query) ||
         laporan.tanggal.toLowerCase().includes(query) ||
         laporan.status.toLowerCase().includes(query)
      )
   })

   return (
      <div className="space-y-6">
         <div>
         <h1 className="text-2xl font-bold">Laporan Masyarakat</h1>
         <p className="text-muted-foreground">Kelola laporan dan aduan dari masyarakat</p>
         </div>

         <Card>
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <div>
               <CardTitle>Daftar Laporan</CardTitle>
               <CardDescription>Daftar laporan dan aduan dari masyarakat</CardDescription>
               </div>
               <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     type="search"
                     placeholder="Cari..."
                     className="pl-8 w-[250px]"
                     value={searchQuery}
                     onChange={handleSearchChange}
                  />
               </div>
               </div>
            </div>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
               <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Pelapor</TableHead>
                  <TableHead>Judul Laporan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
               </TableRow>
               </TableHeader>
               <TableBody>
               {filteredData.length > 0 ? (
                  filteredData.map((laporan) => (
                     <TableRow key={laporan.id}>
                     <TableCell>{laporan.id}</TableCell>
                     <TableCell>{laporan.nama}</TableCell>
                     <TableCell>{laporan.judul}</TableCell>
                     <TableCell>{laporan.kategori}</TableCell>
                     <TableCell>{laporan.tanggal}</TableCell>
                     <TableCell>
                        <Badge className={getStatusColor(laporan.status)}>{laporan.status}</Badge>
                     </TableCell>
                     <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                           <LihatLaporanModal
                              id={laporan.id}
                              nama={laporan.nama}
                              judul={laporan.judul}
                              kategori={laporan.kategori}
                              tanggal={laporan.tanggal}
                              status={laporan.status}
                              isi={laporan.isi}
                              lokasi={laporan.lokasi}
                              kontak={laporan.kontak}
                              gambar={laporan.gambar}
                           />
                           <UbahStatusLaporanModal
                              id={laporan.id}
                              nama={laporan.nama}
                              judul={laporan.judul}
                              status={laporan.status}
                              onStatusChange={handleStatusChange}
                           />
                        </div>
                     </TableCell>
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={7} className="text-center py-4">
                     Tidak ada data yang sesuai dengan pencarian
                     </TableCell>
                  </TableRow>
               )}
               </TableBody>
            </Table>
         </CardContent>
         </Card>
      </div>
   )
}

