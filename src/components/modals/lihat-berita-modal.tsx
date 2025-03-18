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
import { Eye } from "lucide-react"

interface LihatBeritaModalProps {
   id: number
   judul: string
   kategori: string
   tanggal: string
   status: string
   konten: string
}

export function LihatBeritaModal({ id, judul, kategori, tanggal, status, konten }: LihatBeritaModalProps) {
   const [open, setOpen] = useState<boolean>(false)

   const getStatusColor = (status: string): string => {
      switch (status) {
         case "Dipublikasikan":
         return "bg-green-100 text-green-800"
         case "Draft":
         return "bg-gray-100 text-gray-800"
         default:
         return "bg-gray-100 text-gray-800"
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Lihat</span>
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px]">
         <DialogHeader>
            <DialogTitle>{judul}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
               <span>{tanggal}</span>
               <span>•</span>
               <span>{kategori}</span>
               <span>•</span>
               <Badge className={getStatusColor(status)}>{status}</Badge>
            </DialogDescription>
         </DialogHeader>
         <div className="py-4">
            <div className="mb-4">
               <img
               src="/placeholder.svg?height=200&width=600"
               alt={judul}
               className="w-full h-48 object-cover rounded-md"
               />
            </div>
            <div className="space-y-4">
               <p className="text-sm text-gray-700 whitespace-pre-line">{konten}</p>
            </div>
         </div>
         <DialogFooter>
            <Button variant="destructive" onClick={() => setOpen(false)}>Tutup</Button>
         </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}

