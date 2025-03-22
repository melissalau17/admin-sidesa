"use client"

import { useState } from "react"
import { Button } from "@/components/ui/buttom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, FileImage } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LihatSuratModalProps {
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

export function LihatSuratModal({
   id,
   nama,
   jenis,
   tanggal,
   status,
   nik,
   alamat,
   keperluan,
   ktpImage,
   kkImage,
   }: LihatSuratModalProps) {
   const [open, setOpen] = useState<boolean>(false)

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

   const keterangan =
      status === "Ditolak"
         ? "Permohonan ditolak karena data tidak lengkap. Silakan lengkapi data dan ajukan kembali."
         : status === "Selesai"
         ? "Surat telah selesai diproses dan dapat diambil di kantor desa."
         : status === "Diproses"
            ? "Surat sedang dalam proses pembuatan dan penandatanganan oleh kepala desa."
            : "Permohonan surat sedang menunggu untuk diproses."

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Lihat</span>
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
         <DialogHeader>
            <DialogTitle>Detail Permohonan Surat</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
               <span>ID: {id}</span>
               <span>•</span>
               <span>{tanggal}</span>
               <span>•</span>
               <Badge className={getStatusColor(status)}>{status}</Badge>
            </DialogDescription>
         </DialogHeader>

         <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
               <TabsTrigger value="info">Informasi</TabsTrigger>
               <TabsTrigger value="ktp">Scan KTP</TabsTrigger>
               <TabsTrigger value="kk">Scan Kartu Keluarga</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="py-4">
               <div className="space-y-4">
               <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                     <p className="text-sm font-medium text-muted-foreground">Jenis Surat</p>
                     <p className="text-sm font-semibold">{jenis}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                     <p className="text-sm font-medium text-muted-foreground">Nama Pemohon</p>
                     <p className="text-sm font-semibold">{nama}</p>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                     <p className="text-sm font-medium text-muted-foreground">NIK</p>
                     <p className="text-sm">{nik}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                     <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                     <p className="text-sm">{alamat}</p>
                  </div>
               </div>

               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Keperluan</p>
                  <p className="text-sm">{keperluan}</p>
               </div>

               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Keterangan</p>
                  <p className="text-sm">{keterangan}</p>
               </div>

               {status === "Selesai" && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                     <p className="text-sm text-green-800">
                     Surat telah selesai dan dapat diambil di kantor desa dengan menunjukkan KTP asli.
                     </p>
                  </div>
               )}
               </div>
            </TabsContent>

            <TabsContent value="ktp" className="py-4">
               {ktpImage ? (
               <div className="flex flex-col items-center space-y-3">
                  <h3 className="text-lg font-medium">Scan KTP</h3>
                  <div className="border rounded-md overflow-hidden">
                     <img
                     src={ktpImage || "/placeholder.svg"}
                     alt="Scan KTP"
                     className="max-w-full h-auto object-contain"
                     />
                  </div>
               </div>
               ) : (
               <div className="flex flex-col items-center justify-center h-40 border rounded-md border-dashed">
                  <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Tidak ada scan KTP yang diunggah</p>
               </div>
               )}
            </TabsContent>

            <TabsContent value="kk" className="py-4">
               {kkImage ? (
               <div className="flex flex-col items-center space-y-3">
                  <h3 className="text-lg font-medium">Scan Kartu Keluarga</h3>
                  <div className="border rounded-md overflow-hidden">
                     <img
                     src={kkImage || "/placeholder.svg"}
                     alt="Scan Kartu Keluarga"
                     className="max-w-full h-auto object-contain"
                     />
                  </div>
               </div>
               ) : (
               <div className="flex flex-col items-center justify-center h-40 border rounded-md border-dashed">
                  <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Tidak ada scan Kartu Keluarga yang diunggah</p>
               </div>
               )}
            </TabsContent>
         </Tabs>

         <DialogFooter>
            <Button onClick={() => setOpen(false)}>Tutup</Button>
         </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}

