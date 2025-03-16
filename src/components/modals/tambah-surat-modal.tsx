"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/buttom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function TambahSuratModal() {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const { toast } = useToast()

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      // Simulasi proses penyimpanan
      setTimeout(() => {
         setIsLoading(false)
         setOpen(false)
         toast({
         title: "Berhasil",
         description: "Permohonan surat berhasil ditambahkan",
         })
      }, 1000)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button className="w-min bg-[#004D40] hover:bg-[#00695C] text-white py-2 rounded-md">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="mr-2 h-4 w-4 ">
               <path d="M5 12h14"></path>
               <path d="M12 5v14"></path>
            </svg>
            Tambah Surat
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px]">
         <DialogHeader>
            <DialogTitle>Tambah Permohonan Surat</DialogTitle>
            <DialogDescription>Tambahkan permohonan surat baru dari masyarakat</DialogDescription>
         </DialogHeader>
         <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="nama" className="text-right">
                  Nama Pemohon
               </Label>
               <Input id="nama" placeholder="Masukkan nama pemohon" className="col-span-3" required />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="nik" className="text-right">
                  NIK
               </Label>
               <Input id="nik" placeholder="Masukkan NIK" className="col-span-3" required />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="jenis-surat" className="text-right">
                  Jenis Surat
               </Label>
               <Select required>
                  <SelectTrigger id="jenis-surat" className="col-span-3">
                     <SelectValue placeholder="Pilih jenis surat" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="domisili">Surat Keterangan Domisili</SelectItem>
                     <SelectItem value="usaha">Surat Keterangan Usaha</SelectItem>
                     <SelectItem value="tidak-mampu">Surat Keterangan Tidak Mampu</SelectItem>
                     <SelectItem value="ktp">Surat Pengantar KTP</SelectItem>
                     <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
               </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="alamat" className="text-right">
                  Alamat
               </Label>
               <Textarea id="alamat" placeholder="Masukkan alamat lengkap" className="col-span-3" required />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="keperluan" className="text-right">
                  Keperluan
               </Label>
               <Textarea id="keperluan" placeholder="Masukkan keperluan" className="col-span-3" required />
               </div>
            </div>
            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
               Batal
               </Button>
               <Button type="submit" className="w-min" variant="ghost" disabled={isLoading}>
               {isLoading ? "Menyimpan..." : "Simpan"}
               </Button>
            </DialogFooter>
         </form>
         </DialogContent>
      </Dialog>
   )
}

