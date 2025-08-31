"use client"

import { useEffect, useState, type FormEvent } from "react"
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
import { Edit } from "lucide-react"

interface EditBeritaModalProps {
    id: number
    judul: string
    kategori: string
    status: string
    kontent: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onBeritaUpdate: (
        berita_id: number,
        updatedBerita: {
            judul: string
            kategori: string
            status: string
            kontent: string
        }
    ) => void
}

export function EditBeritaModal({
    id,
    judul,
    kategori,
    status,
    kontent,
    open,
    onOpenChange,
    onBeritaUpdate,
}: EditBeritaModalProps) {
    const [formData, setFormData] = useState({
        judul,
        kategori,
        status,
        kontent,
    })
    const [photo, setPhoto] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        if (open) {
            setFormData({ judul, kategori, status, kontent });
            setPhoto(null);
            // Assuming the photo comes from the API and is a URL
            if (kontent) {
                // Here's where we would fetch and set the preview if kontent had a photo URL
                // For now, let's assume we don't have a photo URL and set a placeholder
                setPreviewUrl(null);
            }
        }
    }, [open, judul, kategori, status, kontent]);


    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const data = new FormData()
        data.append("judul", formData.judul)
        data.append("kategori", formData.kategori)
        data.append("status", formData.status)
        data.append("kontent", formData.kontent)
        if (photo) {
            data.append("photo", photo)
        }

        try {
            const token = localStorage.getItem("token")
            
            // Perbaikan kecil: Gunakan axios daripada fetch
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            
            const updated = res.data;
            onBeritaUpdate(id, updated.data);

            toast({
                title: "Berhasil",
                description: "Berita berhasil diperbarui",
            })

            onOpenChange(false)
        } catch (error) {
            console.error("Error updating berita:", error)
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat memperbarui berita",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    className="bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white"
                    size="sm"
                >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogHeader>
                    <DialogTitle id="dialog-title">Edit Berita</DialogTitle>
                    <DialogDescription id="dialog-description">Perbarui berita atau informasi desa</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                            <Label htmlFor="judul" className="sm:text-right">
                                Judul Berita
                            </Label>
                            <Input
                                id="judul"
                                placeholder="Masukkan judul berita"
                                className="col-span-3"
                                required
                                value={formData.judul}
                                onChange={(e) => handleChange("judul", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                            <Label htmlFor="kategori" className="sm:text-right">
                                Kategori
                            </Label>
                            <Select
                                required
                                value={formData.kategori}
                                onValueChange={(value) => handleChange("kategori", value)}
                            >
                                <SelectTrigger id="kategori" className="col-span-3 border-b border-gray-300">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Infrastruktur">Infrastruktur</SelectItem>
                                    <SelectItem value="Pertanian">Pertanian</SelectItem>
                                    <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                                    <SelectItem value="Ekonomi">Ekonomi</SelectItem>
                                    <SelectItem value="Budaya">Budaya</SelectItem>
                                    <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                            <Label htmlFor="gambar" className="sm:text-right">
                                Gambar
                            </Label>
                            <Input
                                id="gambar"
                                type="file"
                                accept="image/*"
                                className="col-span-3"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setPhoto(file)
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            setPreviewUrl(reader.result as string)
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                            />
                        </div>
                        {previewUrl && (
                            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                                <Label className="sm:text-right">
                                    Pratinjau
                                </Label>
                                <img src={previewUrl} alt="Pratinjau Gambar" className="col-span-3 object-cover rounded-md max-h-48 w-full" />
                            </div>
                        )}
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-start sm:gap-4">
                            <Label htmlFor="kontent" className="sm:text-right pt-2">
                                Konten Berita
                            </Label>
                            <Textarea
                                id="kontent"
                                placeholder="Masukkan konten berita"
                                className="col-span-3 min-h-[250px] text-justify border-b border-gray-300"
                                required
                                value={formData.kontent}
                                onChange={(e) => handleChange("kontent", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                            <Label className="sm:text-right">Status</Label>
                            <RadioGroup
                                value={formData.status}
                                onValueChange={(value) => handleChange("status", value)}
                                className="col-span-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Draft" id="draft" />
                                    <Label htmlFor="draft">Draft</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Dipublikasikan" id="publish" />
                                    <Label htmlFor="publish">Publikasikan</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="ghost"
                            disabled={
                                isLoading ||
                                !formData.judul ||
                                !formData.kategori ||
                                !formData.kontent
                            }
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
