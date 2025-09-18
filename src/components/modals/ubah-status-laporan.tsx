"use client"

import { useState, type FormEvent, useCallback } from "react"
import { Button } from "@/components/ui/button"
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
  keluhan: string
  status: string
  onStatusChange: (id: number, newStatus: string) => void
}

export function UbahStatusLaporanModal({
  id,
  nama,
  keluhan,
  status,
  onStatusChange,
}: UbahStatusLaporanModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(status)
  const { toast } = useToast()

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Token tidak ditemukan")

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: selectedStatus }),
          }
        )

        if (!res.ok) throw new Error("Gagal mengubah status laporan")

        onStatusChange(id, selectedStatus)
        toast({
          title: "Berhasil",
          description: `Status laporan berhasil diubah menjadi ${selectedStatus}`,
        })
        setOpen(false)
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengubah status laporan"
        toast({
          title: "Gagal",
          description: message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [id, selectedStatus, onStatusChange, toast]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-purple-100"
          size="sm"
        >
          <ClipboardCheck className="h-4 w-4" />
          <span className="sr-only">Ubah Status</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Status Laporan</DialogTitle>
          <DialogDescription>
            Ubah status laporan dari {nama} - {keluhan}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Status Laporan</Label>
              <RadioGroup
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                className="flex flex-col space-y-2"
              >
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
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}