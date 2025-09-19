"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";

export function TambahBeritaModal({ triggerOpen = false, onSuccess }: { triggerOpen?: boolean; onSuccess?: () => void }) {
    const [open, setOpen] = useState(triggerOpen);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        judul: "",
        kategori: "",
        kontent: "", 
        status: "Draft",
        photo_url: null as File | null,
    });

    const { toast } = useToast();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, photo_url: file }));
    };
    
    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, kategori: value }));
    };

    const handleRadioChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const { judul, kategori, kontent, status, photo_url } = formData;

        if (!judul || !kategori || !kontent || !status || !photo_url) {
            toast({
                title: "Gagal",
                description: "Semua field harus diisi!",
                variant: "destructive"
            });
            setIsLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append("judul", judul);
            data.append("kategori", kategori);
            data.append("kontent", kontent);
            data.append("status", status);
            if (photo_url) {
                data.append("photo", photo_url);
            }

            const token = localStorage.getItem("token");

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });

            toast({
                title: "Berhasil",
                description: "Berita berhasil ditambahkan",
            });

            setOpen(false);
            setFormData({
                judul: "",
                kategori: "",
                kontent: "",
                status: "Draft",
                photo_url: null,
            });

            onSuccess?.();
        } catch (error) {
            console.error("Error creating berita:", error);
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menambahkan berita",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-min bg-[#004D40] hover:bg-[#00695C] text-white py-2 rounded-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Berita
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="deskripsi-modal">
                <DialogHeader>
                    <DialogTitle>Tambah Berita Desa</DialogTitle>
                    <DialogDescription id="deskripsi-modal">Tambahkan berita atau informasi desa baru</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                            <Label htmlFor="judul" className="sm:text-right">Judul Berita</Label>
                            <Input
                                id="judul"
                                value={formData.judul}
                                onChange={handleInputChange}
                                placeholder="Masukkan judul berita"
                                className="sm:col-span-3 w-full"
                                required
                            />
                        </div>
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
                            <Label htmlFor="kategori" className="sm:text-right">Kategori</Label>
                            <Select onValueChange={handleSelectChange} value={formData.kategori} required>
                                <SelectTrigger id="kategori" className="sm:col-span-3 border-b border-gray-300">
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
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="sm:col-span-3 w-full"
                                required
                            />
                        </div>
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-start gap-4">
                            <Label htmlFor="kontent" className="sm:text-right pt-2">Konten Berita</Label>
                            <Textarea
                                id="kontent"
                                value={formData.kontent}
                                onChange={handleInputChange}
                                placeholder="Masukkan konten berita"
                                className="sm:col-span-3 min-h-[150px] border-b border-gray-300 w-full"
                                required
                            />
                        </div>
                        <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-4">
                            <Label className="sm:text-right">Status</Label>
                            <RadioGroup value={formData.status} onValueChange={handleRadioChange} className="sm:col-span-3 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Draft" id="draft" />
                                    <Label htmlFor="draft">Draft</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Dipublikasikan" id="publish" />
                                    <Label htmlFor="publish">Publikasikan Sekarang</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button type="button" variant="destructive" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="ghost"
                            disabled={isLoading || !formData.judul || !formData.kategori || !formData.kontent || !formData.photo_url}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}