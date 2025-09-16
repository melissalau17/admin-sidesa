"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import Image from "next/image"; // Import Next.js Image component

interface EditBeritaModalProps {
    id: number;
    judul: string;
    kategori: string;
    status: string;
    kontent: string;
    photoUrl?: string | null; // Added initial photoUrl prop
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBeritaUpdate: (
        berita_id: number,
        updatedBerita: {
            judul: string;
            kategori: string;
            status: string;
            kontent: string;
            photo_url?: string; // Corrected to photo_url
        }
    ) => void;
}

const jenisSuratOptions = ["Infrastruktur", "Pertanian", "Kesehatan", "Ekonomi", "Budaya", "Pendidikan"];

export function EditBeritaModal({
    id,
    judul,
    kategori,
    status,
    kontent,
    photoUrl, // Destructure new prop
    open,
    onOpenChange,
    onBeritaUpdate,
}: EditBeritaModalProps) {
    const [formData, setFormData] = useState({ judul, kategori, status, kontent });
    const [photo, setPhoto] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(photoUrl || null); // Initialize with prop
    const { toast } = useToast();

    // Sync form data and preview URL with incoming props
    useEffect(() => {
        setFormData({ judul, kategori, status, kontent });
        setPreviewUrl(photoUrl || null);
        setPhoto(null);
    }, [judul, kategori, status, kontent, photoUrl, open]);


    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPhoto(null);
            setPreviewUrl(photoUrl || null);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append("judul", formData.judul);
        data.append("kategori", formData.kategori);
        data.append("status", formData.status);
        data.append("kontent", formData.kontent);
        if (photo) {
            data.append("photo", photo);
        }

        try {
            const token = localStorage.getItem("token");

            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Update the state in the parent component
            onBeritaUpdate(id, { ...formData, photo_url: previewUrl || undefined });

            toast({
                title: "Berhasil",
                description: "Berita berhasil diperbarui",
            });

            onOpenChange(false);
        } catch (error) {
            console.error("Error updating berita:", error);
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat memperbarui berita",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Removed redundant DialogTrigger, as the parent component manages 'open' state */}
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
                                    {jenisSuratOptions.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
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
                                onChange={handleFileChange}
                            />
                        </div>
                        {previewUrl && (
                            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                                <Label className="sm:text-right">
                                    Pratinjau
                                </Label>
                                <div className="col-span-3">
                                    <Image
                                        src={previewUrl}
                                        alt="Pratinjau Gambar"
                                        width={400}
                                        height={200}
                                        className="object-cover rounded-md max-h-48 w-full"
                                        unoptimized // Required for Base64 or external URLs
                                    />
                                </div>
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
    );
}