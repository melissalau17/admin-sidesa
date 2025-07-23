"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import Image from "next/image";
import axios from "axios";

interface LihatBeritaModalProps {
    id: number;
}

interface BeritaDetail {
    judul: string;
    kategori: string;
    tanggal: string;
    status: string;
    kontent: string;
    photo?: string;
}

export function LihatBeritaModal({ id }: LihatBeritaModalProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [berita, setBerita] = useState<BeritaDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            const token = localStorage.getItem("token");

            const fetchBerita = async () => {
                try {
                    setLoading(true);
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/beritas/${id}`,
                        {
                            headers: {
                                Authorization: token ? `Bearer ${token}` : "",
                            },
                        }
                    );
                    setBerita(res.data.data); // adjust based on actual API structure
                    setError("");
                } catch (err: any) {
                    setError("Gagal memuat berita.");
                    setBerita(null);
                } finally {
                    setLoading(false);
                }
            };

            fetchBerita();
        }
    }, [open, id]);


    const getStatusColor = (status: string): string => {
        switch (status) {
            case "Dipublikasikan":
                return "bg-green-100 text-green-800";
            case "Draft":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const convertPhotoToBase64 = (photoData: number[]): string => {
        try {
            const byteArray = photoData;
            const mime =
                byteArray[0] === 0xff && byteArray[1] === 0xd8
                    ? "image/jpeg"
                    : byteArray[0] === 0x89 && byteArray[1] === 0x50
                        ? "image/png"
                        : "image/jpeg";

            const binary = byteArray.map((b) => String.fromCharCode(b)).join("");
            const base64 = btoa(binary);
            return `data:${mime};base64,${base64}`;
        } catch (err) {
            console.error("Gagal konversi gambar:", err);
            return "/placeholder.svg?height=200&width=600";
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-blue-100"
                    size="sm"
                >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Lihat</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{berita?.judul || "Detail Berita"}</DialogTitle>

                    {berita && (
                        <>
                            <DialogDescription>
                                {berita.tanggal} • {berita.kategori}
                            </DialogDescription>
                            <div className="mt-1">
                                <Badge className={getStatusColor(berita.status)}>{berita.status}</Badge>
                            </div>
                        </>
                    )}
                </DialogHeader>


                {loading ? (
                    <p className="text-center py-4">Memuat...</p>
                ) : error ? (
                    <p className="text-center text-red-500 py-4">{error}</p>
                ) : berita ? (
                    <div className="py-4">
                        <div className="mb-4">
                            <img
                                src={
                                    berita.photo && Array.isArray(berita.photo)
                                        ? convertPhotoToBase64(berita.photo)
                                        : "/placeholder.svg?height=200&width=600"
                                }
                                alt={berita.judul}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="space-y-4 pr-6">
                            <p className="text-sm text-gray-700 whitespace-pre-line text-wrap text-justify">
                                {berita.kontent}
                            </p>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
