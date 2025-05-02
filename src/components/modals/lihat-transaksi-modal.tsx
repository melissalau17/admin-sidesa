"use client"

import { useState } from "react"
import { Button } from "@/components/ui/buttom"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LihatTransaksiModalProps {
   id: number
   keterangan: string
   tanggal: string
   jenis: string
   jumlah: string
   kategori?: string
   catatan?: string
}

export function LihatTransaksiModal({
   id,
   keterangan,
   tanggal,
   jenis,
   jumlah,
   kategori = "-",
   catatan = "-",
}: LihatTransaksiModalProps) {
   const [open, setOpen] = useState<boolean>(false)
   const [isDownloading, setIsDownloading] = useState<boolean>(false)
   const { toast } = useToast()

   const getJenisColor = (jenis: string): string => {
      switch (jenis) {
         case "Pemasukan":
         return "bg-green-100 text-green-800"
         case "Pengeluaran":
         return "bg-red-100 text-red-800"
         default:
         return "bg-gray-100 text-gray-800"
      }
   }

   const handleDownloadReceipt = () => {
      setIsDownloading(true)

      // Simulate download process
      setTimeout(() => {
         setIsDownloading(false)
         toast({
         title: "Berhasil",
         description: `Bukti transaksi ${keterangan} berhasil diunduh`,
         })
      }, 1000)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Detail</span>
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[550px]">
         <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
               <span>ID: {id}</span>
               <span>•</span>
               <span>{tanggal}</span>
            </DialogDescription>
         </DialogHeader>

         <div className="py-4">
            <div className="space-y-4">
               <div className="flex justify-between items-center">
               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Keterangan</p>
                  <p className="text-lg font-semibold">{keterangan}</p>
               </div>
               <Badge className={getJenisColor(jenis)}>{jenis}</Badge>
               </div>

               <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                  <p className="text-sm">{kategori}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Jumlah</p>
                  <p className={`text-lg font-bold ${jenis === "Pemasukan" ? "text-green-600" : "text-red-600"}`}>
                     {jumlah}
                  </p>
               </div>
               </div>

               <div className="space-y-1">
               <p className="text-sm font-medium text-muted-foreground">Catatan</p>
               <div className="text-sm p-3 bg-gray-50 rounded-md border">
                  <p>{catatan}</p>
               </div>
               </div>

               <div className="pt-2">
               <p className="text-sm text-muted-foreground">
                  Transaksi ini {jenis === "Pemasukan" ? "menambah" : "mengurangi"} saldo desa pada tanggal {tanggal}.
               </p>
               </div>
            </div>
         </div>
         </DialogContent>
      </Dialog>
   )
}
