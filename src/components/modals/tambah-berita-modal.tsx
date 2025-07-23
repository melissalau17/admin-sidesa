"use client"

import { useState, type FormEvent } from "react"
import axios from "axios"
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

export function TambahBeritaModal({ triggerOpen = false, onSuccess }: { triggerOpen?: boolean; onSuccess?: () => void }) {
  const [open, setOpen] = useState(triggerOpen);
  const [isLoading, setIsLoading] = useState(false)

  const [judul, setJudul] = useState("")
  const [kategori, setKategori] = useState("")
  const [konten, setKonten] = useState("")
  const [status, setStatus] = useState("draft")
  const [photo, setPhoto] = useState<File | null>(null)

  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("judul", judul)
      formData.append("kategori", kategori)
      formData.append("kontent", konten)
      formData.append("status", status)
      if (photo) {
        formData.append("photo", photo)
      }

      const token = localStorage.getItem("token");

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      })

      toast({
        title: "Berhasil",
        description: "Berita berhasil ditambahkan",
      })

      setOpen(false)
      setJudul("")
      setKategori("")
      setKonten("")
      setStatus("draft")
      setPhoto(null)

      onSuccess?.()
    } catch (error) {
      console.error("Error creating berita:", error)
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menambahkan berita",
        variant: "destructive",
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
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          Tambah Berita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Berita Desa</DialogTitle>
          <DialogDescription>Tambahkan berita atau informasi desa baru</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="judul" className="sm:text-right">Judul Berita</Label>
              <Input id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Masukkan judul berita" className="w-full md:col-span-5" required />
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="kategori" className="sm:text-right">Kategori</Label>
              <Select onValueChange={(val) => setKategori(val)} required>
                <SelectTrigger id="kategori" className="sm:col-span-2 border-b border-gray-300">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="infrastruktur">Infrastruktur</SelectItem>
                  <SelectItem value="pertanian">Pertanian</SelectItem>
                  <SelectItem value="kesehatan">Kesehatan</SelectItem>
                  <SelectItem value="ekonomi">Ekonomi</SelectItem>
                  <SelectItem value="budaya">Budaya</SelectItem>
                  <SelectItem value="pendidikan">Pendidikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label htmlFor="gambar" className="sm:text-right">Gambar</Label>
              <Input id="gambar" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="sm:col-span-3 w-full" />
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-start gap-4">
              <Label htmlFor="konten" className="sm:text-right pt-2">Konten Berita</Label>
              <Textarea
                id="konten"
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                placeholder="Masukkan konten berita"
                className="sm:col-span-3 min-h-[150px] border-b border-gray-300 w-full"
                required
              />
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
              <Label className="sm:text-right">Status</Label>
              <RadioGroup defaultValue="draft" value={status} onValueChange={(val) => setStatus(val)} className="sm:col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="draft" />
                  <Label htmlFor="draft">Draft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="publish" id="publish" />
                  <Label htmlFor="publish">Publikasikan Sekarang</Label>
                </div>
              </RadioGroup>
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
