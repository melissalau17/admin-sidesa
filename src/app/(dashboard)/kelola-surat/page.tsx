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

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (err) => reject(err)
    })

type PhotoInput = File | string
type PhotoData = string | null

interface SuratItem {
    surat_id: number
    nama: string
    jenis_surat: string
    tanggal: string
    status: string
    nik: string
    alamat: string
    tujuan_surat: string
    photo_ktp: PhotoData
    photo_kk: PhotoData
    foto_usaha?: PhotoData
    gaji_ortu?: PhotoData
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
    if (typeof window === "undefined") return defaultStatus
    const saved = localStorage.getItem(`status-${surat_id}`)
    return saved || defaultStatus
}

const saveStatus = (surat_id: number, status: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(`status-${surat_id}`, status)
    }
}

export default function KelolaSuratPage() {
    const [suratData, setSuratData] = useState<SuratItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchSurat = async () => {
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/letters`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const rawData = Array.isArray(response.data.data)
                ? response.data.data
                : Array.isArray(response.data)
                    ? response.data
                    : []

                const convertPhotoToBase64 = (photoData: PhotoData): string | null => {
                    if (!photoData) return null
                    if (typeof photoData === "string") {
                        return photoData.startsWith("data:") ? photoData : `data:image/jpeg;base64,${photoData}`
                    }
                    return null
                }

                const formatted: SuratItem[] = rawData.map((surat: SuratItem) => ({
                    ...surat,
                    tanggal: new Date(surat.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric"
                    }),
                    photo_ktp: convertPhotoToBase64(surat.photo_ktp),
                    photo_kk: convertPhotoToBase64(surat.photo_kk),
                    foto_usaha: convertPhotoToBase64(surat.foto_usaha ?? null),
                    gaji_ortu: convertPhotoToBase64(surat.gaji_ortu ?? null),
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
        setSuratData(prev =>
            prev.map(surat => ({
            ...surat,
            status: getSavedStatus(surat.surat_id, surat.status),
            }))
        )
    }, [])

    const handleDeleteSurat = async (id: number) => {
        if (!confirm("Yakin ingin menghapus surat ini?")) return

        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
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
        saveStatus(id, newStatus)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleAddSurat = async (newSurat: Omit<SuratItem, "surat_id" | "photo_ktp" | "photo_kk"> & {
        photo_ktp: PhotoInput
        photo_kk: PhotoInput
    }) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

            const isFile = (file: PhotoInput): file is File => file instanceof File

            const ktpBase64 = isFile(newSurat.photo_ktp)
                ? await fileToBase64(newSurat.photo_ktp)
                : newSurat.photo_ktp

            const kkBase64 = isFile(newSurat.photo_kk)
                ? await fileToBase64(newSurat.photo_kk)
                : newSurat.photo_kk

            // Prepare FormData for backend
            const formData = new FormData()
            Object.entries({ ...newSurat, photo_ktp: ktpBase64, photo_kk: kkBase64 }).forEach(([key, value]) => {
                if (value !== undefined && value !== null) formData.append(key, value as string | Blob)
            })

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/letters`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            // Store Base64 string in state
            const savedSurat: SuratItem = {
                ...response.data,
                tanggal: new Date(response.data.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric"
                }),
                photo_ktp: ktpBase64,
                photo_kk: kkBase64
            }

            setSuratData(prev => [...prev, savedSurat])
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

            {/* Error & Loading */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {loading && <p className="text-gray-500 text-sm">Memuat data...</p>}

            {/* Tabel */}
            {!loading && (
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
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                        onClick={() => handleDeleteSurat(surat.surat_id)}
                                                    >
                                                        Hapus
                                                    </button>
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
            )}
        </div>
    )
}
