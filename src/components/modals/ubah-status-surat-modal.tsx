"use client"

import { useState, type FormEvent } from "react"
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { FileText } from "lucide-react"

interface UbahStatusSuratModalProps {
   id: number
   nama: string
   jenis: string
   status: string
   onStatusChange: (id: number, newStatus: string) => void
}

export function UbahStatusSuratModal({ id, nama, jenis, status, onStatusChange }: UbahStatusSuratModalProps) {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [selectedStatus, setSelectedStatus] = useState<string>(status)
   const { toast } = useToast()

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      // Simulasi proses penyimpanan
      setTimeout(() => {
         // Update the status in the parent component
         onStatusChange(id, selectedStatus)

         setIsLoading(false)
         setOpen(false)
         toast({
         title: "Berhasil",
         description: `Status surat berhasil diubah menjadi ${selectedStatus}`,
         })
      }, 1000)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Ubah Status</span>
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
         <DialogHeader>
            <DialogTitle>Ubah Status Surat</DialogTitle>
            <DialogDescription>
               Ubah status permohonan surat untuk {nama} - {jenis}
            </DialogDescription>
         </DialogHeader>
         <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
               <div className="space-y-2">
               <Label>Status Surat</Label>
               <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="Menunggu" id="menunggu" />
                     <Label htmlFor="menunggu" className="font-normal">
                     Menunggu
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="Diproses" id="diproses" />
                     <Label htmlFor="diproses" className="font-normal">
                     Diproses
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="Selesai" id="selesai" />
                     <Label htmlFor="selesai" className="font-normal">
                     Selesai
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="Ditolak" id="ditolak" />
                     <Label htmlFor="ditolak" className="font-normal">
                     Ditolak
                     </Label>
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

