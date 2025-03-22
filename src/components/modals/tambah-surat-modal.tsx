"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Button } from "@/components/ui/buttom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface TambahSuratModalProps {
   onAddSurat: (newSurat: {
      nama: string
      jenis: string
      tanggal: string
      status: string
      nik: string
      alamat: string
      keperluan: string
      ktpImage?: string
      kkImage?: string
   }) => void
}

export function TambahSuratModal({ onAddSurat }: TambahSuratModalProps) {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [formData, setFormData] = useState({
      nama: "",
      nik: "",
      jenis: "",
      alamat: "",
      keperluan: "",
      ktpImage: "",
      kkImage: "",
   })
   const { toast } = useToast()

   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target
      setFormData((prev) => ({ ...prev, [id]: value }))
   }

   const handleSelectChange = (value: string) => {
      setFormData((prev) => ({ ...prev, jenis: value }))
   }

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
      const file = e.target.files?.[0]
      if (file) {
         // In a real app, you would upload the file to a server and get a URL
         // For this demo, we'll use a placeholder
         setFormData((prev) => ({
         ...prev,
         [fieldName]: "/placeholder.svg?height=300&width=500",
         }))
      }
   }

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      // Validate form
      if (!formData.nama || !formData.nik || !formData.jenis || !formData.alamat || !formData.keperluan) {
         toast({
         title: "Error",
         description: "Semua field harus diisi",
         variant: "destructive",
         })
         setIsLoading(false)
         return
      }

      // Simulasi proses penyimpanan
      setTimeout(() => {
         // Add the new surat to the parent component
         onAddSurat({
         ...formData,
         tanggal: format(new Date(), "d MMM yyyy", { locale: id }),
         status: "Menunggu",
         })

         setIsLoading(false)
         setOpen(false)

         // Reset form
         setFormData({
         nama: "",
         nik: "",
         jenis: "",
         alamat: "",
         keperluan: "",
         ktpImage: "",
         kkImage: "",
         })

         toast({
         title: "Berhasil",
         description: "Permohonan surat berhasil ditambahkan",
         })
      }, 1000)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button variant="ghost">
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
               className="mr-2 h-4 w-4"
            >
               <path d="M5 12h14"></path>
               <path d="M12 5v14"></path>
            </svg>
            Tambah Surat
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px]">
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
               <Input
                  id="nama"
                  placeholder="Masukkan nama pemohon"
                  className="col-span-3"
                  required
                  value={formData.nama}
                  onChange={handleInputChange}
               />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="nik" className="text-right">
                  NIK
               </Label>
               <Input
                  id="nik"
                  placeholder="Masukkan NIK"
                  className="col-span-3"
                  required
                  value={formData.nik}
                  onChange={handleInputChange}
               />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="jenis-surat" className="text-right">
                  Jenis Surat
               </Label>
               <Select required value={formData.jenis} onValueChange={handleSelectChange}>
                  <SelectTrigger id="jenis-surat" className="col-span-3">
                     <SelectValue placeholder="Pilih jenis surat" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="Surat Keterangan Domisili">Surat Keterangan Domisili</SelectItem>
                     <SelectItem value="Surat Keterangan Usaha">Surat Keterangan Usaha</SelectItem>
                     <SelectItem value="Surat Keterangan Tidak Mampu">Surat Keterangan Tidak Mampu</SelectItem>
                     <SelectItem value="Surat Pengantar KTP">Surat Pengantar KTP</SelectItem>
                     <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
               </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="alamat" className="text-right">
                  Alamat
               </Label>
               <Textarea
                  id="alamat"
                  placeholder="Masukkan alamat lengkap"
                  className="col-span-3"
                  required
                  value={formData.alamat}
                  onChange={handleInputChange}
               />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="keperluan" className="text-right">
                  Keperluan
               </Label>
               <Textarea
                  id="keperluan"
                  placeholder="Masukkan keperluan"
                  className="col-span-3"
                  required
                  value={formData.keperluan}
                  onChange={handleInputChange}
               />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="ktp" className="text-right">
                  Scan KTP
               </Label>
               <Input
                  id="ktp"
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                  required
                  onChange={(e) => handleFileChange(e, "ktpImage")}
               />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="kk" className="text-right">
                  Scan Kartu Keluarga
               </Label>
               <Input
                  id="kk"
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                  required
                  onChange={(e) => handleFileChange(e, "kkImage")}
               />
               </div>
            </div>
            <DialogFooter>
               <Button type="button" variant="destructive" onClick={() => setOpen(false)}>
               Batal
               </Button>
               <Button type="submit" variant="ghost" disabled={isLoading}>
               {isLoading ? "Menyimpan..." : "Simpan"}
               </Button>
            </DialogFooter>
         </form>
         </DialogContent>
      </Dialog>
   )
}