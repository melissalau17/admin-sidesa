"use client"

import { useState, type FormEvent } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function TambahTransaksiModal() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // State untuk input
  const [jenis, setJenis] = useState("pemasukan")
  const [keterangan, setKeterangan] = useState("")
  const [kategori, setKategori] = useState("")
  const [jumlah, setJumlah] = useState("")
  const [catatan, setCatatan] = useState("")
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/finances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jenis: jenis === "pemasukan" ? "Pemasukan" : "Pengeluaran",
          keterangan,
          kategori,
          jumlah: parseInt(jumlah),
          catatan,
          tanggal: tanggal?.toISOString().split("T")[0],
        }),
      })

      if (!res.ok) throw new Error("Gagal menambahkan transaksi")

      toast({
        title: "Berhasil",
        description: "Transaksi berhasil ditambahkan",
      })

      // Reset
      setOpen(false)
      setJenis("pemasukan")
      setKeterangan("")
      setKategori("")
      setJumlah("")
      setCatatan("")
      setTanggal(new Date())
    } catch (error) {
      toast({
        title: "Gagal",
        description: (error as Error).message,
      })
    } finally {
      setIsLoading(false)
    }
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Tambah Transaksi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Keuangan</DialogTitle>
          <DialogDescription>Tambahkan transaksi keuangan desa baru</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Jenis Transaksi */}
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label className="sm:text-right">Jenis Transaksi</Label>
              <RadioGroup
                value={jenis}
                onValueChange={setJenis}
                className="sm:col-span-3 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pemasukan" id="pemasukan" />
                  <Label htmlFor="pemasukan">Pemasukan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pengeluaran" id="pengeluaran" />
                  <Label htmlFor="pengeluaran">Pengeluaran</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Keterangan */}
            <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="keterangan" className="sm:text-right">Keterangan</Label>
              <Input
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Masukkan keterangan transaksi"
                className="col-span-3"
                required
              />
            </div>

            {/* Kategori */}
            <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="kategori" className="sm:text-right">Kategori</Label>
              <Select value={kategori} onValueChange={setKategori} required>
                <SelectTrigger id="kategori" className="col-span-3 border-b border-gray-300">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {["Dana Desa", "Retribusi", "Bantuan", "Infrastruktur", "Operasional", "Gaji", "Lainnya"].map((val) => (
                    <SelectItem key={val} value={val.toLowerCase()} className="hover:bg-[#129990]">
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal */}
            <div className="lex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="tanggal" className="sm:text-right">Tanggal</Label>
              <div className="col-span-3">
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"default"}
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !tanggal && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tanggal ? format(tanggal, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={tanggal}
                        onSelect={(date: Date | undefined) => {
                            setTanggal(date)
                            setIsDatePickerOpen(false)
                        }}
                        initialFocus
                        className=""
                        classNames={{}}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Jumlah */}
            <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="jumlah" className="sm:text-right">Jumlah (Rp)</Label>
              <Input
                id="jumlah"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Masukkan jumlah"
                className="col-span-3"
                required
                type="number"
                min="0"
                step="1000"
              />
            </div>

            {/* Catatan */}
            <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="catatan" className="sm:text-right">Catatan</Label>
              <Textarea
                id="catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Masukkan catatan tambahan (opsional)"
                className="col-span-3 border-b border-gray-300"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="destructive" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" variant="ghost" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
