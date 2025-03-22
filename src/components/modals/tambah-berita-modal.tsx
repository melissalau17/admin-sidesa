"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/buttom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function TambahBeritaModal() {
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
         description: "Berita berhasil ditambahkan",
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
               className="mr-2 h-4 w-4"
            >
               <path d="M5 12h14"></path>
               <path d="M12 5v14"></path>
            </svg>
            Tambah Berita
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[700px]">
         <DialogHeader>
            <DialogTitle>Tambah Berita Desa</DialogTitle>
            <DialogDescription>Tambahkan berita atau informasi desa baru</DialogDescription>
         </DialogHeader>
         <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="judul" className="text-right">
                  Judul Berita
               </Label>
               <Input id="judul" placeholder="Masukkan judul berita" className="col-span-4" required />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="kategori" className="text-right">
                  Kategori
               </Label>
               <Select required>
                  <SelectTrigger id="kategori" className="col-span-1">
                     <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="infrastruktur">Infrastruktur</SelectItem>
                     <SelectItem value="pertanian">Pertanian</SelectItem>
                     <SelectItem value="kesehatan">Kesehatan</SelectItem>
                     <SelectItem value="ekonomi">Ekonomi</SelectItem>
                     <SelectItem value="budaya">Budaya</SelectItem>
                     <SelectItem value="pendidikan">Pendidikan</SelectItem>
                  </SelectContent>
               </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="gambar" className="text-right">
                  Gambar
               </Label>
               <Input id="gambar" type="file" accept="image/*" className="col-span-4" />
               </div>
               <div className="grid grid-cols-4 items-start gap-4">
               <Label htmlFor="konten" className="text-right pt-2">
                  Konten Berita
               </Label>
               <Textarea
                  id="konten"
                  placeholder="Masukkan konten berita"
                  className="col-span-3 min-h-[150px]"
                  required
               />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label className="text-right">Status</Label>
               <RadioGroup defaultValue="draft" className="col-span-3">
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="draft" id="draft" />
                     <Label htmlFor="draft">Draft</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="publish" id="publish" />
                     <Label htmlFor="publish">Publikasikan Sekarang</Label>
                  </div>
               </RadioGroup>
               </div>
            </div>
            <DialogFooter>
               <Button type="button" variant="destructive" onClick={() => setOpen(false)}>
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
