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
import { Edit } from "lucide-react"

interface EditBeritaModalProps {
   id: number
   judul: string
   kategori: string
   status: string
   konten: string
   onBeritaUpdate: (
      id: number,
      updatedBerita: {
         judul: string
         kategori: string
         status: string
         konten: string
      },
   ) => void
}

export function EditBeritaModal({ id, judul, kategori, status, konten, onBeritaUpdate }: EditBeritaModalProps) {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [formData, setFormData] = useState({
      judul,
      kategori,
      status,
      konten,
   })
   const { toast } = useToast()

   const handleChange = (field: string, value: string) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }))
   }

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      // Simulasi proses penyimpanan
      setTimeout(() => {
         // Update the berita in the parent component
         onBeritaUpdate(id, formData)

         setIsLoading(false)
         setOpen(false)
         toast({
         title: "Berhasil",
         description: "Berita berhasil diperbarui",
         })
      }, 1000)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button className="bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-amber-100" size="sm">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
         <DialogHeader>
            <DialogTitle>Edit Berita</DialogTitle>
            <DialogDescription>Edit berita atau informasi desa</DialogDescription>
         </DialogHeader>
         <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="judul" className="text-right">
                  Judul Berita
               </Label>
               <Input
                  id="judul"
                  placeholder="Masukkan judul berita"
                  className="col-span-3"
                  required
                  value={formData.judul}
                  onChange={(e) => handleChange("judul", e.target.value)}
               />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="kategori" className="text-right">
                  Kategori
               </Label>
               <Select required value={formData.kategori} onValueChange={(value) => handleChange("kategori", value)}>
                  <SelectTrigger id="kategori" className="col-span-3 border-b border-gray-300">
                     <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="Infrastruktur">Infrastruktur</SelectItem>
                     <SelectItem value="Pertanian">Pertanian</SelectItem>
                     <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                     <SelectItem value="Ekonomi">Ekonomi</SelectItem>
                     <SelectItem value="Budaya">Budaya</SelectItem>
                     <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                  </SelectContent>
               </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="gambar" className="text-right">
                  Gambar
               </Label>
               <Input id="gambar" type="file" accept="image/*" className="col-span-3" />
               </div>
               <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="konten" className="text-right pt-2">
                     Konten Berita
                  </Label>
                  <Textarea
                     id="konten"
                     placeholder="Masukkan konten berita"
                     className="col-span-3 min-h-[250px] text-justify border-b border-gray-300"
                     required
                     value={formData.konten}
                     onChange={(e) => handleChange("konten", e.target.value)}
                  />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label className="text-right">Status</Label>
               <RadioGroup
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                  className="col-span-3"
               >
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="Draft" id="draft" />
                     <Label htmlFor="draft">Draft</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="Dipublikasikan" id="publish" />
                     <Label htmlFor="publish">Publikasikan</Label>
                  </div>
               </RadioGroup>
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

