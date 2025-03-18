"use client"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UbahStatusLaporanModal } from "../../../components/modals/ubah-status-laporan"

interface LaporanItem {
   id: number
   nama: string
   judul: string
   kategori: string
   tanggal: string
   status: string
}

const initialLaporanData: LaporanItem[] = [
  {
    id: 1,
    nama: "Agus Setiawan",
    judul: "Jalan Rusak di RT 03",
    kategori: "Infrastruktur",
    tanggal: "11 Mar 2025",
    status: "Belum Direspon",
  },
  {
    id: 2,
    nama: "Rina Wati",
    judul: "Lampu Jalan Mati di Perempatan",
    kategori: "Infrastruktur",
    tanggal: "9 Mar 2025",
    status: "Diproses",
  },
  {
    id: 3,
    nama: "Hendra Gunawan",
    judul: "Sampah Menumpuk di Pasar",
    kategori: "Lingkungan",
    tanggal: "7 Mar 2025",
    status: "Selesai",
  },
  {
    id: 4,
    nama: "Sri Wahyuni",
    judul: "Kegiatan Mencurigakan di Rumah Kosong",
    kategori: "Keamanan",
    tanggal: "5 Mar 2025",
    status: "Diproses",
  },
  {
    id: 5,
    nama: "Dedi Kurniawan",
    judul: "Saluran Air Tersumbat",
    kategori: "Lingkungan",
    tanggal: "2 Mar 2025",
    status: "Selesai",
  },
]

const getStatusColor = (status: string): string => {
   switch (status) {
      case "Belum Direspon":
         return "bg-red-100 text-red-800"
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
                        <UbahStatusLaporanModal
                           id={laporan.id}
                           nama={laporan.nama}
                           judul={laporan.judul}
                           status={laporan.status}
                           onStatusChange={handleStatusChange}/>
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

