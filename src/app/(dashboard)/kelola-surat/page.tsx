"use client"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SearchComponent } from "@/components/ui/SearchComponent"
import { TambahSuratModal } from "@/components/modals/tambah-surat-modal"
import { UbahStatusSuratModal } from "@/components/modals/ubah-status-surat-modal"
import { LihatSuratModal } from "@/components/modals/lihat-surat-modal"
import * as Tooltip from "@radix-ui/react-tooltip"

interface SuratItem {
   id: number
   nama: string
   jenis: string
   tanggal: string
   status: string
   nik: string
   alamat: string
   keperluan: string
   ktpImage?: string
   kkImage?: string
}

const initialSuratData: SuratItem[] = [
   {
      id: 1,
      nama: "Ahmad Suparjo",
      jenis: "Surat Keterangan Domisili",
      tanggal: "12 Mar 2025",
      status: "Diproses",
      nik: "3507112509870001",
      alamat: "Dusun Sukamaju RT 03/RW 02, Desa Contoh",
      keperluan: "Untuk keperluan administrasi di kantor kecamatan terkait pengurusan izin usaha.",
      ktpImage: "/placeholder.svg?height=300&width=500",
      kkImage: "/placeholder.svg?height=300&width=500",
   },
   {
      id: 2,
      nama: "Siti Aminah",
      jenis: "Surat Keterangan Usaha",
      tanggal: "10 Mar 2025",
      status: "Diproses",
      nik: "3507112509880002",
      alamat: "Dusun Harapan Jaya RT 05/RW 03, Desa Contoh",
      keperluan: "Untuk keperluan pengajuan kredit usaha di Bank BRI.",
      ktpImage: "/placeholder.svg?height=300&width=500",
      kkImage: "/placeholder.svg?height=300&width=500",
   },
   {
      id: 3,
      nama: "Budi Santoso",
      jenis: "Surat Keterangan Tidak Mampu",
      tanggal: "8 Mar 2025",
      status: "Selesai",
      nik: "3507112509890003",
      alamat: "Dusun Makmur RT 02/RW 01, Desa Contoh",
      keperluan: "Untuk keperluan pengajuan beasiswa pendidikan anak.",
      ktpImage: "/placeholder.svg?height=300&width=500",
      kkImage: "/placeholder.svg?height=300&width=500",
   },
   {
      id: 4,
      nama: "Dewi Lestari",
      jenis: "Surat Pengantar KTP",
      tanggal: "5 Mar 2025",
      status: "Selesai",
      nik: "3507112509900004",
      alamat: "Dusun Sukamaju RT 01/RW 02, Desa Contoh",
      keperluan: "Untuk keperluan pembuatan KTP baru karena hilang.",
      ktpImage: "/placeholder.svg?height=300&width=500",
      kkImage: "/placeholder.svg?height=300&width=500",
   },
   {
      id: 5,
      nama: "Joko Widodo",
      jenis: "Surat Keterangan Domisili",
      tanggal: "1 Mar 2025",
      status: "Selesai",
      nik: "3507112509910005",
      alamat: "Dusun Harapan Jaya RT 04/RW 03, Desa Contoh",
      keperluan: "Untuk keperluan administrasi di tempat kerja.",
      ktpImage: "/placeholder.svg?height=300&width=500",
      kkImage: "/placeholder.svg?height=300&width=500",
   },
]

const getStatusColor = (status: string): string => {
   switch (status) {
      case "Menunggu":
         return "bg-yellow-100 text-yellow-800"
      case "Diproses":
         return "bg-gray-100 text-gray-800"
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

   // Function to add new surat
   const handleAddSurat = (newSurat: Omit<SuratItem, "id">) => {
      const newId = suratData.length > 0 ? Math.max(...suratData.map((item) => item.id)) + 1 : 1
      setSuratData((prev) => [...prev, { id: newId, ...newSurat }])
   }

   // Filter data based on search query
   const filteredData = suratData.filter((surat) => {
      const query = searchQuery.toLowerCase()
      return (
         surat.nama.toLowerCase().includes(query) ||
         surat.jenis.toLowerCase().includes(query) ||
         surat.tanggal.toLowerCase().includes(query) ||
         surat.status.toLowerCase().includes(query) ||
         surat.nik.toLowerCase().includes(query)
      )
   })

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold">Kelola Surat</h1>
               <p className="text-muted-foreground">Kelola permohonan surat dari masyarakat</p>
            </div>
            {/* Tambahkan Tooltip untuk Tombol Tambah Surat */}
            <Tooltip.Provider delayDuration={200}>
               <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                     <div className="relative inline-block">
                        <TambahSuratModal onAddSurat={handleAddSurat} />
                     </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                     <Tooltip.Content 
                        side="bottom" 
                        sideOffset={6}
                        className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                        avoidCollisions
                        collisionPadding={8}
                     >
                        Tambah Surat Baru
                        <Tooltip.Arrow className="fill-white" width={10} height={5} />
                     </Tooltip.Content>
                  </Tooltip.Portal>
               </Tooltip.Root>
            </Tooltip.Provider>
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
                        <SearchComponent 
                           searchQuery={searchQuery}
                           onSearchChange={handleSearchChange}
                           placeholder="Cari nama, jenis, status..."
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
                                 <div className="flex justify-end gap-2">
                                    {/* Tambahkan Tooltip untuk Tombol Lihat Surat */}
                                    <Tooltip.Provider delayDuration={300}>
                                       <Tooltip.Root>
                                          <Tooltip.Trigger asChild>
                                             <div className="relative inline-block">
                                                <LihatSuratModal
                                                   id={surat.id}
                                                   nama={surat.nama}
                                                   jenis={surat.jenis}
                                                   tanggal={surat.tanggal}
                                                   status={surat.status}
                                                   nik={surat.nik}
                                                   alamat={surat.alamat}
                                                   keperluan={surat.keperluan}
                                                   ktpImage={surat.ktpImage}
                                                   kkImage={surat.kkImage}
                                                />
                                             </div>
                                          </Tooltip.Trigger>
                                          <Tooltip.Portal>
                                             <Tooltip.Content 
                                                side="top" 
                                                sideOffset={6}
                                                className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                                avoidCollisions
                                                collisionPadding={8}
                                             >
                                                Lihat Detail Surat
                                                <Tooltip.Arrow className="fill-white" width={10} height={5} />
                                             </Tooltip.Content>
                                          </Tooltip.Portal>
                                       </Tooltip.Root>
                                    </Tooltip.Provider>

                                    {/* Tambahkan Tooltip untuk Tombol Ubah Status */}
                                    <Tooltip.Provider delayDuration={300}>
                                       <Tooltip.Root>
                                          <Tooltip.Trigger asChild>
                                             <div className="relative inline-block">
                                                <UbahStatusSuratModal
                                                   id={surat.id}
                                                   nama={surat.nama}
                                                   jenis={surat.jenis}
                                                   status={surat.status}
                                                   onStatusChange={handleStatusChange}
                                                />
                                             </div>
                                          </Tooltip.Trigger>
                                          <Tooltip.Portal>
                                             <Tooltip.Content 
                                                side="top" 
                                                sideOffset={6}
                                                className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                                avoidCollisions
                                                collisionPadding={8}
                                             >
                                                Ubah Status Surat
                                                <Tooltip.Arrow className="fill-white" width={10} height={5} />
                                             </Tooltip.Content>
                                          </Tooltip.Portal>
                                       </Tooltip.Root>
                                    </Tooltip.Provider>
                                 </div>
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