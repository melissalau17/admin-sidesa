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
import { Edit } from "lucide-react"

interface UserItem {
   id: number
   nama: string
   username: string
   password: string
   photo: string
   nik: string
   alamat: string
   jenis_kelamin: "Laki-laki" | "Perempuan"
   no_hp: string
}

interface EditUserModalProps {
   user: UserItem
   onUpdateUser: (id: number, updatedUser: Partial<UserItem>) => void
}

export function EditUserModal({ user, onUpdateUser }: EditUserModalProps) {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [formData, setFormData] = useState<UserItem>({ ...user })

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
         onUpdateUser(user.id, formData)
         setIsLoading(false)
         setOpen(false)
      }, 1000)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button className="bg-amber-100 text-amber-500 hover:bg-amber-500 hover:text-amber-100" size="sm">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
         <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Edit informasi pengguna sistem</DialogDescription>
         </DialogHeader>
         <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="nama" className="text-right">
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
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="username" className="text-right">
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
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="password" className="text-right">
                  Password
               </Label>
               <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password baru (kosongkan jika tidak diubah)"
                  className="col-span-3"
                  value={formData.password}
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
               <Label htmlFor="no_hp" className="text-right">
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
               <div className="grid grid-cols-4 items-center gap-4">
               <Label className="text-right">Jenis Kelamin</Label>
               <RadioGroup
                  value={formData.jenis_kelamin}
                  onValueChange={(value) => handleSelectChange("jenis_kelamin", value)}
                  className="col-span-3 flex space-x-4"
               >
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="Laki-laki" id="edit-laki-laki" />
                     <Label htmlFor="edit-laki-laki" className="font-normal">
                     Laki-laki
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="Perempuan" id="edit-perempuan" />
                     <Label htmlFor="edit-perempuan" className="font-normal">
                     Perempuan
                     </Label>
                  </div>
               </RadioGroup>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               </div>
               <div className="grid grid-cols-4 items-start gap-4">
               <Label htmlFor="alamat" className="text-right pt-2">
                  Alamat
               </Label>
               <Textarea
                  id="alamat"
                  placeholder="Masukkan alamat lengkap"
                  className="col-span-3 border-gray-200"
                  required
                  value={formData.alamat}
                  onChange={handleInputChange}
               />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="photo" className="text-right">
                  Foto
               </Label>
               <Input id="photo" type="file" accept="image/*" className="col-span-3" onChange={handleFileChange} />
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
