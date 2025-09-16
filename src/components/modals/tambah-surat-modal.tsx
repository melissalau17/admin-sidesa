"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface TambahSuratModalProps {
    onAddSurat: (newSurat: {
        surat_id: number
        nama: string
        jenis: string
        tanggal: string
        status: string
        nik: string
        alamat: string
        keperluan: string
        ktpImage?: File
        kkImage?: File
    }) => void
}

const jenisSuratOptions = [
    "Surat Keterangan Domisili",
    "Surat Keterangan Usaha",
    "Surat Keterangan Tidak Mampu",
    "Surat Pengantar KTP",
    "Lainnya"
]

export function TambahSuratModal({ onAddSurat }: TambahSuratModalProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        nama: "",
        nik: "",
        jenis: "",
        alamat: "",
        keperluan: "",
        ktpImage: undefined as File | undefined,
        kkImage: undefined as File | undefined
    })
    const { toast } = useToast()

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: "ktpImage" | "kkImage") => {
        const file = e.target.files?.[0]
        if (file) setFormData((prev) => ({ ...prev, [field]: file }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const { nama, nik, jenis, alamat, keperluan, ktpImage, kkImage } = formData

        if (!nama || !nik || !jenis || !alamat || !keperluan) {
            toast({
                title: "Error",
                description: "Semua field harus diisi",
                variant: "destructive"
            })
            setIsLoading(false)
            return
        }

        const data = new FormData()
        data.append("nama", nama)
        data.append("nik", nik)
        data.append("jenis_surat", jenis)
        data.append("alamat", alamat)
        data.append("tujuan_surat", keperluan)
        if (ktpImage) data.append("photo_ktp", ktpImage)
        if (kkImage) data.append("photo_kk", kkImage)

        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/letters`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Specify content type for FormData
                }
            })

            const surat_id = response.data?.surat_id ?? Math.floor(Math.random() * 1000000)

            const newSurat = {
                surat_id,
                nama,
                nik,
                jenis,
                alamat,
                keperluan,
                status: "Menunggu",
                tanggal: new Date().toISOString()
            }

            onAddSurat(newSurat)

            setOpen(false)
            setFormData({
                nama: "",
                nik: "",
                jenis: "",
                alamat: "",
                keperluan: "",
                ktpImage: undefined,
                kkImage: undefined
            })

            toast({
                title: "Berhasil",
                description: "Permohonan surat berhasil ditambahkan"
            })
        } catch (err) {
            console.error(err)
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat mengirim data.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    Tambah Surat
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
                onOpenAutoFocus={(e) => {
                    e.preventDefault()
                }}>
                <DialogHeader>
                    <DialogTitle>Tambah Permohonan Surat</DialogTitle>
                    <DialogDescription>Tambahkan permohonan surat baru dari masyarakat</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {[
                            { id: "nama", label: "Nama Pemohon", type: "text" },
                            { id: "nik", label: "NIK", type: "text" }
                        ].map(({ id, label, type }) => (
                            <div key={id} className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                <Label htmlFor={id} className="sm:text-right text-left">
                                    {label}
                                </Label>
                                <Input
                                    id={id}
                                    type={type}
                                    required
                                    value={formData[id as "nama" | "nik"]}
                                    onChange={handleInputChange}
                                    placeholder={`Masukkan ${label.toLowerCase()}`}
                                    className="sm:col-span-3"
                                />
                            </div>
                        ))}

                        <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                            <Label htmlFor="jenis" className="sm:text-right text-left">Jenis Surat</Label>
                            <Select value={formData.jenis} onValueChange={(val) => setFormData((p) => ({ ...p, jenis: val }))}>
                                <SelectTrigger id="jenis" className="sm:col-span-3">
                                    <SelectValue placeholder="Pilih jenis surat" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jenisSuratOptions.map((opt) => (
                                        <SelectItem key={opt} value={opt} className="hover:bg-[#129990]">
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {[
                            { id: "alamat", label: "Alamat" },
                            { id: "keperluan", label: "Keperluan" }
                        ].map(({ id, label }) => (
                            <div key={id} className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                <Label htmlFor={id} className="sm:text-right text-left">{label}</Label>
                                <Textarea
                                    id={id}
                                    required
                                    placeholder={`Masukkan ${label.toLowerCase()}`}
                                    className="sm:col-span-3"
                                    value={formData[id as "alamat" | "keperluan"]}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}

                        {[
                            { id: "photo_ktp", label: "Scan KTP", field: "ktpImage" },
                            { id: "kk", label: "Scan Kartu Keluarga", field: "kkImage" }
                        ].map(({ id, label, field }) => (
                            <div key={id} className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                <Label htmlFor={id} className="sm:text-right text-left">{label}</Label>
                                <Input
                                    id={id}
                                    type="file"
                                    accept="image/*"
                                    className="sm:col-span-3"
                                    onChange={(e) => handleFileChange(e, field as "ktpImage" | "kkImage")}
                                />
                            </div>
                        ))}
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