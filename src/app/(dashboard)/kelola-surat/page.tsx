"use client"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TambahSuratModal } from "@/components/modals/tambah-surat-modal"
import { UbahStatusSuratModal } from "@/components/modals/ubah-status-surat-modal"

interface SuratItem {
   id: number
   nama: string
   jenis: string
   tanggal: string
   status: string
}

const initialSuratData: SuratItem[] = [
   {
      id: 1,
      nama: "Ahmad Suparjo",
      jenis: "Surat Keterangan Domisili",
      tanggal: "12 Mar 2025",
      status: "Menunggu",
   },
   {
      id: 2,
      nama: "Siti Aminah",
      jenis: "Surat Keterangan Usaha",
      tanggal: "10 Mar 2025",
      status: "Diproses",
   },
   {
      id: 3,
      nama: "Budi Santoso",
      jenis: "Surat Keterangan Tidak Mampu",
      tanggal: "8 Mar 2025",
      status: "Selesai",
   },
   {
      id: 4,
      nama: "Dewi Lestari",
      jenis: "Surat Pengantar KTP",
      tanggal: "5 Mar 2025",
      status: "Selesai",
   },
   {
      id: 5,
      nama: "Joko Widodo",
      jenis: "Surat Keterangan Domisili",
      tanggal: "1 Mar 2025",
      status: "Selesai",
   },
]

const getStatusColor = (status: string): string => {
   switch (status) {
      case "Menunggu":
         return "bg-yellow-100 text-yellow-800"
      case "Diproses":
         return "bg-blue-100 text-blue-800"
      case "Selesai":
         return "bg-green-100 text-green-800"
      case "Ditolak":
         return "bg-red-100 text-red-800"
      default:
         return "bg-gray-100 text-gray-800"
   }
}

export default function KelolaSuratPage() {
   const [suratData, setSuratData] = useState<SuratItem[]>(initialSuratData)
   const [searchQuery, setSearchQuery] = useState<string>("")

   // Function to update the status of a surat
   const handleStatusChange = (id: number, newStatus: string) => {
      setSuratData((prevData) => prevData.map((surat) => (surat.id === id ? { ...surat, status: newStatus } : surat)))
   }

   // Function to handle search input changes
   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
   }

   // Filter data based on search query
   const filteredData = suratData.filter((surat) => {
      const query = searchQuery.toLowerCase()
      return (
         surat.nama.toLowerCase().includes(query) ||
         surat.jenis.toLowerCase().includes(query) ||
         surat.tanggal.toLowerCase().includes(query) ||
         surat.status.toLowerCase().includes(query)
      )
   })

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold">Kelola Surat</h1>
            <p className="text-muted-foreground">Kelola permohonan surat dari masyarakat</p>
         </div>
         <TambahSuratModal />
         </div>

         <Card>
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <div>
               <CardTitle>Daftar Permohonan Surat</CardTitle>
               <CardDescription>Daftar permohonan surat yang masuk</CardDescription>
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
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Surat</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
               </TableRow>
               </TableHeader>
               <TableBody>
               {filteredData.length > 0 ? (
                  filteredData.map((surat) => (
                     <TableRow key={surat.id}>
                     <TableCell>{surat.id}</TableCell>
                     <TableCell>{surat.nama}</TableCell>
                     <TableCell>{surat.jenis}</TableCell>
                     <TableCell>{surat.tanggal}</TableCell>
                     <TableCell>
                        <Badge className={getStatusColor(surat.status)}>{surat.status}</Badge>
                     </TableCell>
                     <TableCell className="text-right">
                        <UbahStatusSuratModal
                           id={surat.id}
                           nama={surat.nama}
                           jenis={surat.jenis}
                           status={surat.status}
                           onStatusChange={handleStatusChange}
                        />
                     </TableCell>
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={6} className="text-center py-4">
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

