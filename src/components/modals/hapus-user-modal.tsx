"use client"

import { useState } from "react"
import { Button } from "@/components/ui/buttom"
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Trash } from "lucide-react"

interface HapusUserModalProps {
   id: number
   nama: string
   onDeleteUser: (id: number) => void
}

export function HapusUserModal({ id, nama, onDeleteUser }: HapusUserModalProps) {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const { toast } = useToast()

   const handleDelete = () => {
      setIsLoading(true)

      // Simulasi proses penghapusan
      setTimeout(() => {
         // Delete the user in the parent component by calling the onDeleteUser function
         onDeleteUser(id)

         setIsLoading(false)
         setOpen(false)
         toast({
         title: "Berhasil",
         description: "User berhasil dihapus",
         })
      }, 1000)
   }

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
         <Button size="sm" className="text-red-500 bg-red-50 hover:text-red-50 hover:bg-red-500">
            <Trash className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
         </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
         <AlertDialogHeader>
            <AlertDialogTitle>Hapus User</AlertDialogTitle>
            <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus user &quot;{nama}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
               onClick={handleDelete}
               disabled={isLoading}
               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
               {isLoading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
         </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

