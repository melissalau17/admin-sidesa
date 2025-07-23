"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import axios from "axios"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SearchComponent } from "@/components/ui/SearchComponent"
import { TambahSuratModal } from "@/components/modals/tambah-surat-modal"
import { UbahStatusSuratModal } from "@/components/modals/ubah-status-surat-modal"
import { LihatSuratModal } from "@/components/modals/lihat-surat-modal"
import * as Tooltip from "@radix-ui/react-tooltip"

interface SuratItem {
    surat_id: number
    nama: string
    jenis_surat: string
    tanggal: string
    status: string
    nik: string
    alamat: string
    tujuan_surat: string
    photo_ktp: File | string
    photo_kk: File | string
    foto_usaha?: File | string
    gaji_ortu?: File | string
}

const getStatusColor = (status: string): string => {
    switch (status) {
        case "Menunggu": return "bg-yellow-100 text-yellow-800"
        case "Diproses": return "bg-gray-100 text-gray-800"
        case "Selesai": return "bg-green-100 text-green-800"
        case "Ditolak": return "bg-red-100 text-red-800"
        default: return "bg-gray-100 text-gray-800"
    }
}

const getSavedStatus = (surat_id: number, defaultStatus: string) => {
    const saved = localStorage.getItem(`status-${surat_id}`)
    return saved || defaultStatus
}

const saveStatus = (surat_id: number, status: string) => {
    localStorage.setItem(`status-${surat_id}`, status)
}

export default function KelolaSuratPage() {
    const [suratData, setSuratData] = useState<SuratItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
    const fetchSurat = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/letters`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const rawData = response.data.data || response.data

            const convertPhotoToBase64 = (photoData: any) => {
                if (!photoData) return null
                try {
                    const byteArray = Object.values(photoData) as number[]
                    const mime =
                        byteArray[0] === 0xff && byteArray[1] === 0xd8
                            ? "image/jpeg"
                            : byteArray[0] === 0x89 && byteArray[1] === 0x50
                                ? "image/png"
                                : "image/jpeg"
                    const binary = byteArray.map((b) => String.fromCharCode(b)).join("")
                    const base64 = btoa(binary)
                    return `data:${mime};base64,${base64}`
                } catch (error) {
                    console.error("Error converting photo:", error)
                    return null
                }
            }

            const formatted = rawData.map((surat: any) => ({
                ...surat,
                tanggal: new Date(surat.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric"
                }),
                photo_ktp: convertPhotoToBase64(surat.photo_ktp),
                photo_kk: convertPhotoToBase64(surat.photo_kk),
                foto_usaha: convertPhotoToBase64(surat.foto_usaha),
                gaji_ortu: convertPhotoToBase64(surat.gaji_ortu),
            }))

            setSuratData(formatted)
        } catch (err) {
            console.error("Fetch gagal:", err)
            setError("Gagal memuat data surat.")
        } finally {
            setLoading(false)
        }
    }

    fetchSurat()
}, [])


    useEffect(() => {
        const updated = suratData.map((surat) => ({
            ...surat,
            status: getSavedStatus(surat.surat_id, surat.status),
        }))
        setSuratData(updated)
    }, [suratData.length])


    const handleDeleteSurat = async (id: number) => {
        if (!confirm("Yakin ingin menghapus surat ini?")) return

        try {
            const token = localStorage.getItem("token")
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/letters/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setSuratData(prev => prev.filter((surat) => surat.surat_id !== id))
        } catch (err) {
            console.error("Gagal menghapus surat:", err)
            alert("Terjadi kesalahan saat menghapus surat.")
        }
    }

    const handleStatusChange = (id: number, newStatus: string) => {
        setSuratData(prev =>
            prev.map(surat =>
                surat.surat_id === id ? { ...surat, status: newStatus } : surat
            )
        )
        saveStatus(id, newStatus) // Simpan status baru ke localStorage
    }


    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleAddSurat = async (newSurat: Omit<SuratItem, "surat_id"> & { surat_id?: number }) => {
        try {
            const token = localStorage.getItem("token")
            const formData = new FormData()

            Object.entries(newSurat).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    formData.append(key, value as any)
                }
            })

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/letters`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const newData = {
                ...response.data,
                tanggal: new Date(response.data.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric"
                }),
                photo_ktp: response.data.photo_ktp,
                photo_kk: response.data.photo_kk,
            }

            setSuratData(prev => [...prev, newData])
        } catch (err) {
            console.error("Gagal menambahkan surat:", err)
        }
    }

    const filteredData = suratData.filter((surat) => {
        const q = searchQuery.toLowerCase()
        return (
            surat.nama.toLowerCase().includes(q) ||
            surat.jenis_surat.toLowerCase().includes(q) ||
            surat.tanggal.toLowerCase().includes(q) ||
            surat.status.toLowerCase().includes(q) ||
            surat.nik.toLowerCase().includes(q)
        )
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Kelola Surat</h1>
                    <p className="text-muted-foreground">Kelola permohonan surat dari masyarakat</p>
                </div>
                <Tooltip.Provider delayDuration={200}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <div className="relative inline-block">
                                <TambahSuratModal
                                    onAddSurat={(surat) => {
                                        if (!surat.ktpImage || !surat.kkImage) return
                                        handleAddSurat({
                                            nama: surat.nama,
                                            jenis_surat: surat.jenis,
                                            tanggal: surat.tanggal,
                                            status: surat.status,
                                            nik: surat.nik,
                                            alamat: surat.alamat,
                                            tujuan_surat: surat.keperluan,
                                            photo_ktp: surat.ktpImage,
                                            photo_kk: surat.kkImage,
                                        })
                                    }}
                                />
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content side="bottom" sideOffset={6} className="bg-white text-xs font-medium px-2.5 py-1.5 rounded shadow-md">
                                Tambah Surat Baru
                                <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </div>

            {/* Tabel */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Permohonan Surat</CardTitle>
                            <CardDescription>Permohonan surat yang masuk</CardDescription>
                        </div>
                        <SearchComponent
                            searchQuery={searchQuery}
                            onSearchChange={handleSearchChange}
                            placeholder="Cari nama, jenis, status..."
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Jenis Surat</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((surat, index) => (
                                    <TableRow key={surat.surat_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{surat.nama}</TableCell>
                                        <TableCell>{surat.jenis_surat}</TableCell>
                                        <TableCell>{surat.tanggal}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(surat.status)}>{surat.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <LihatSuratModal
                                                    id={surat.surat_id}
                                                    nama={surat.nama}
                                                    jenis_surat={surat.jenis_surat}
                                                    tanggal={surat.tanggal}
                                                    status={surat.status}
                                                    nik={surat.nik}
                                                    alamat={surat.alamat}
                                                    tujuan_surat={surat.tujuan_surat}
                                                    photo_ktp={surat.photo_ktp}
                                                    photo_kk={surat.photo_kk}
                                                />
                                                <UbahStatusSuratModal
                                                    id={surat.surat_id}
                                                    nama={surat.nama}
                                                    jenis={surat.jenis_surat}
                                                    status={surat.status}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        Tidak ada data yang sesuai
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
