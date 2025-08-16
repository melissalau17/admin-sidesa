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

interface UbahStatusSuratModalProps {
  id: number
  nama: string
  jenis: string
  status: string
  onStatusChange?: (id: number, newStatus: string) => void
}

export function UbahStatusSuratModal({
  id,
  nama,
  jenis,
  status,
  onStatusChange,
}: UbahStatusSuratModalProps) {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/letters/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: selectedStatus }),
          }
        )

        if (!res.ok) throw new Error("Gagal mengubah status surat")

        onStatusChange?.(id, selectedStatus)
        toast({
          title: "Berhasil",
          description: `Status surat berhasil diubah menjadi ${selectedStatus}`,
        })
        setOpen(false)
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengubah status"
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
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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
              <RadioGroup
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                className="flex flex-col space-y-2"
              >
                {["Menunggu", "Diproses", "Selesai", "Ditolak"].map(
                  (item, idx) => {
                    const idValue = `${item.toLowerCase()}-${idx}`
                    return (
                      <div className="flex items-center space-x-2" key={idValue}>
                        <RadioGroupItem value={item} id={idValue} />
                        <Label htmlFor={idValue} className="font-normal">
                          {item}
                        </Label>
                      </div>
                    )
                  }
                )}
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