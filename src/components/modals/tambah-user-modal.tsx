"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserPlus } from "lucide-react"

interface TambahUserModalProps {
   onAddUser: (newUser: {
      nama: string
      username: string
      password: string
      photo: string
      nik: string
      alamat: string
      jenis_kelamin: "Laki-laki" | "Perempuan"
      no_hp: string
      role: "Masyarakat"
   }) => void
}

export function TambahUserModal({ onAddUser }: TambahUserModalProps) {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [formData, setFormData] = useState({
      nama: "",
      username: "",
      password: "",
      photo: "/placeholder.svg?height=128&width=128",
      nik: "",
      alamat: "",
      jenis_kelamin: "Laki-laki" as "Laki-laki" | "Perempuan",
      no_hp: "",
      role: "Masyarakat" as const,
   })

   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target
      setFormData((prev) => ({ ...prev, [id]: value }))
   }

   const handleSelectChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
   }

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         // In a real app, you would upload the file to a server and get a URL
         // For this demo, we'll use a placeholder
         setFormData((prev) => ({
         ...prev,
         photo: "/placeholder.svg?height=128&width=128",
         }))
      }
   }

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
         onAddUser(formData)
         setIsLoading(false)
         setOpen(false)

         // Reset form
         setFormData({
         nama: "",
         username: "",
         password: "",
         photo: "/placeholder.svg?height=128&width=128",
         nik: "",
         alamat: "",
         jenis_kelamin: "Laki-laki",
         no_hp: "",
         role: "Masyarakat",
         })
      }, 1000)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button type="button" variant="ghost">
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah User
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
         <DialogHeader>
            <DialogTitle>Tambah User Baru</DialogTitle>
            <DialogDescription>Tambahkan pengguna baru ke sistem administrasi desa</DialogDescription>
         </DialogHeader>
         <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
               <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                  <Label htmlFor="nama" className="sm:text-right">
                     Nama Lengkap
                  </Label>
                  <Input
                     id="nama"
                     placeholder="Masukkan nama lengkap"
                     className="col-span-3"
                     required
                     value={formData.nama}
                     onChange={handleInputChange}
                  />
               </div>
               <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                  <Label htmlFor="username" className="sm:text-right">
                     Username
                  </Label>
                  <Input
                     id="username"
                     placeholder="Masukkan username"
                     className="col-span-3"
                     required
                     value={formData.username}
                     onChange={handleInputChange}
                  />
               </div>
               <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
               <Label htmlFor="password" className="sm:text-right">
                  Password
               </Label>
               <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="col-span-3"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
               />
               </div>
               <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
               <Label htmlFor="nik" className="sm:text-right">
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
               <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
               <Label htmlFor="no_hp" className="sm:text-right">
                  No. HP
               </Label>
               <Input
                  id="no_hp"
                  placeholder="Masukkan nomor HP"
                  className="col-span-3"
                  required
                  value={formData.no_hp}
                  onChange={handleInputChange}
               />
               </div>
               <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                  <Label className="sm:text-right">Jenis Kelamin</Label>
                  <RadioGroup
                     value={formData.jenis_kelamin}
                     onValueChange={(value) => handleSelectChange("jenis_kelamin", value)}
                     className="col-span-3 flex space-x-4"
                  >
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Laki-laki" id="laki-laki" />
                        <Label htmlFor="laki-laki" className="font-normal">
                        Laki-laki
                        </Label>
                     </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Perempuan" id="perempuan" />
                        <Label htmlFor="perempuan" className="font-normal">
                        Perempuan
                        </Label>
                     </div>
                  </RadioGroup>
               </div>
               <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
               <Label htmlFor="role" className="sm:text-right">
                  Role
               </Label>
               <div className="col-span-3">
                  <Input id="role" value="Masyarakat" disabled className="bg-gray-100" />
               </div>
               </div>
               <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
               <Label htmlFor="alamat" className="sm:text-right">
                  Alamat
               </Label>
               <Textarea
                  id="alamat"
                  placeholder="Masukkan alamat lengkap"
                  className="col-span-3 border-gray-300"
                  required
                  value={formData.alamat}
                  onChange={handleInputChange}
               />
               </div>
               <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
               <Label htmlFor="photo" className="sm:text-right">
                  Foto
               </Label>
               <Input id="photo" type="file" accept="image/*" className="col-span-3" onChange={handleFileChange} />
               </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
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
