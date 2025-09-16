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
import axios from "axios";
import Image from "next/image"; // Import Next.js Image component

interface LihatBeritaModalProps {
    berita_id: number;
}

interface BeritaDetail {
    judul: string;
    kategori: string;
    tanggal: string;
    status: string;
    kontent: string;
    // We assume the backend is refactored to always return a URL string
    photo_url?: string;
}

export function LihatBeritaModal({ berita_id }: LihatBeritaModalProps) {
    const [open, setOpen] = useState(false);
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
                        `${process.env.NEXT_PUBLIC_API_URL}/api/beritas/${berita_id}`,
                        {
                            headers: {
                                Authorization: token ? `Bearer ${token}` : "",
                            },
                        }
                    );

                    // Assume backend now returns a direct URL in 'photo_url'
                    const beritaData = res.data.data;
                    setBerita(beritaData);
                    setError("");
                } catch (err) {
                    console.error("Fetch berita gagal:", err);
                    setError("Gagal memuat berita.");
                    setBerita(null);
                } finally {
                    setLoading(false);
                }
            };

            fetchBerita();
        }
    }, [open, berita_id]);

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

            <DialogContent
                className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogHeader>
                    <DialogTitle id="dialog-title">{berita?.judul || "Detail Berita"}</DialogTitle>
                    {berita && (
                        <>
                            <DialogDescription id="dialog-description">
                                {berita.tanggal} • {berita.kategori}
                            </DialogDescription>
                            <div className="mt-1">
                                <Badge className={getStatusColor(berita.status)}>
                                    {berita.status}
                                </Badge>
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
                            {berita.photo_url ? (
                                <Image
                                    src={berita.photo_url}
                                    alt={berita.judul}
                                    width={600}
                                    height={200}
                                    className="w-full h-full object-cover rounded-md"
                                    // Use unoptimized for external URLs, though Next.js can be configured for it
                                    unoptimized
                                />
                            ) : (
                                <Image
                                    src="/placeholder.svg"
                                    alt="Placeholder"
                                    width={600}
                                    height={200}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            )}
                        </div>
                        <div className="space-y-4 pr-6">
                            <p className="text-sm text-gray-700 whitespace-pre-line text-justify">
                                {berita.kontent}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center py-4 text-gray-500">Tidak ada data berita</p>
                )}
            </DialogContent>
        </Dialog>
    );
}