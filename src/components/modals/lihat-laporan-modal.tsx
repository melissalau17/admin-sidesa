"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, FileImage } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";

interface LihatLaporanModalProps {
    id: number
    nama: string
    keluhan: string
    vote: number
    tanggal: string
    status: string
    deskripsi: string
    lokasi?: string
    kontak?: string
    gambar?: string | number[]
}

export function LihatLaporanModal({
    id,
    nama,
    keluhan,
    vote,
    tanggal,
    status,
    deskripsi,
    lokasi,
    kontak,
    gambar,
}: LihatLaporanModalProps) {
    const [open, setOpen] = useState<boolean>(false)

    const getStatusColor = (status: string): string => {
        switch (status) {
            case "Diproses":
                return "bg-blue-100 text-blue-800"
            case "Selesai":
                return "bg-green-100 text-green-800"
            case "Ditolak":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const keterangan =
        status === "Selesai"
            ? "Laporan telah ditindaklanjuti dan diselesaikan oleh petugas desa."
            : status === "Diproses"
                ? "Laporan sedang dalam proses penanganan oleh petugas desa."
                : status === "Ditolak"
                    ? "Laporan telah ditolak dan tidak akan ditindaklanjuti lebih lanjut."
                    : "Status laporan belum tersedia."

    const convertPhotoToBase64 = (photoData: Uint8Array): string => {
        try {
            const mime =
                photoData[0] === 0xff && photoData[1] === 0xd8
                    ? "image/jpeg"
                    : photoData[0] === 0x89 && photoData[1] === 0x50
                        ? "image/png"
                        : "image/jpeg"

            let binary = ""
            for (let i = 0; i < photoData.length; i++) {
                binary += String.fromCharCode(photoData[i])
            }

            return `data:${mime};base64,${btoa(binary)}`
        } catch (error) {
            console.error("Konversi Base64 gagal:", error)
            return ""
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-blue-100" size="sm">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Lihat</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Laporan Masyarakat</DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                        <span>ID: {id}</span>
                        <span>•</span>
                        <span>{tanggal}</span>
                        <span>•</span>
                        <Badge className={getStatusColor(status)}>{status}</Badge>
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full bg-gray-300 grid-cols-2">
                        <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 rounded-lg">
                            Informasi
                        </TabsTrigger>
                        <TabsTrigger value="gambar" className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 rounded-lg">
                            Foto Laporan
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB INFO */}
                    <TabsContent value="info" className="py-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1 col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Judul Laporan</p>
                                    <p className="text-sm font-semibold">{keluhan}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Deskripsi</p>
                                    <p className="text-sm">{deskripsi}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Nama Pelapor</p>
                                    <p className="text-sm">{nama}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Kontak</p>
                                    <p className="text-sm">{kontak || "-"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Lokasi</p>
                                    <p className="text-sm">{lokasi || "-"}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Jumlah Vote Laporan</p>
                                <div className="text-sm p-3 bg-gray-50 rounded-md border">
                                    <p className="whitespace-pre-line text-justify">{vote}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Keterangan Status</p>
                                <p className="text-sm">{keterangan}</p>
                            </div>

                            {status === "Selesai" && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-800">
                                        Laporan telah diselesaikan. Terima kasih atas partisipasi Anda.
                                    </p>
                                </div>
                            )}

                            {status === "Diproses" && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        Laporan sedang diproses oleh petugas desa.
                                    </p>
                                </div>
                            )}

                            {status === "Ditolak" && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-800">
                                        Laporan ini telah ditolak dan tidak akan ditindaklanjuti.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* TAB GAMBAR */}
                    <TabsContent value="gambar" className="py-4">
                        {gambar ? (
                            <div className="flex flex-col items-center space-y-3">
                                <h3 className="text-lg font-medium">Foto Laporan</h3>
                                <div className="border rounded-md overflow-hidden">
                                    <Image
                                        src={Array.isArray(gambar) ? convertPhotoToBase64(new Uint8Array(gambar)) : gambar}
                                        alt={`Foto laporan ${nama}`}
                                        width={600}
                                        height={400}
                                        className="object-contain rounded-md"
                                        style={{ maxWidth: "100%", height: "auto" }}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                    Foto yang dilampirkan oleh pelapor sebagai bukti pendukung
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 border rounded-md border-dashed">
                                <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">Tidak ada foto yang dilampirkan</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
