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
import { ClipboardCheck } from "lucide-react"

interface UbahStatusLaporanModalProps {
  id: number
  nama: string
  judul: string
  status: string
  onStatusChange: (id: number, newStatus: string) => void
}

export function UbahStatusLaporanModal({ id, nama, judul, status, onStatusChange }: UbahStatusLaporanModalProps) {
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
        description: `Status laporan berhasil diubah menjadi ${selectedStatus}`,
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-purple-100" size="sm">
          <ClipboardCheck className="h-4 w-4" />
          <span className="sr-only">Ubah Status</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Status Laporan</DialogTitle>
          <DialogDescription>
            Ubah status laporan dari {nama} - {judul}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Status Laporan</Label>
              <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus} className="flex flex-col space-y-2">
                <div className="flex items-center mt-2 space-x-2">
                  <RadioGroupItem value="Diproses" id="diproses" />
                  <Label htmlFor="diproses" className="font-normal">
                    Sedang Diproses
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Selesai" id="selesai" />
                  <Label htmlFor="selesai" className="font-normal">
                    Selesai
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

