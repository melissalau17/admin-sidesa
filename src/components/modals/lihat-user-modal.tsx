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
import { Eye } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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

interface LihatUserModalProps {
   user: UserItem
}

export function LihatUserModal({ user }: LihatUserModalProps) {
   const [open, setOpen] = useState<boolean>(false)


   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button type="button" className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-blue-100" size="sm">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Lihat</span>
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[550px]">
         <DialogHeader>
            <DialogTitle>Detail User</DialogTitle>
            <DialogDescription>Informasi lengkap pengguna</DialogDescription>
         </DialogHeader>

         <div className="py-4">
            <div className="flex flex-col items-center mb-6">
               <Avatar className="h-24 w-24 mb-4 bg-amber-200">
               <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.nama} />
               <AvatarFallback className="text-2xl">{user.nama.charAt(0)}</AvatarFallback>
               </Avatar>
               <h3 className="text-xl font-bold">{user.nama}</h3>
            </div>

            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <p className="text-sm font-semibold">{user.username}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">NIK</p>
                  <p className="text-sm">{user.nik}</p>
               </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Jenis Kelamin</p>
                  <p className="text-sm">{user.jenis_kelamin}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">No. HP</p>
                  <p className="text-sm">{user.no_hp}</p>
               </div>
               </div>

               <div className="space-y-1">
               <p className="text-sm font-medium text-muted-foreground">Alamat</p>
               <p className="text-sm p-3 bg-gray-50 rounded-md border">{user.alamat}</p>
               </div>
            </div>
         </div>

         <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Tutup</Button>
         </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
