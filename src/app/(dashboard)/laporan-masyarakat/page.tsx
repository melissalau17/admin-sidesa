"use client"

import { useState, useEffect, useMemo, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SearchComponent } from "@/components/ui/SearchComponent"
import { UbahStatusLaporanModal } from "../../../components/modals/ubah-status-laporan"
import { LihatLaporanModal } from "@/components/modals/lihat-laporan-modal"
import * as Tooltip from "@radix-ui/react-tooltip"
import axios from "axios"

interface LaporanItem {
    laporan_id: number
    nama: string
    keluhan: string
    deskripsi: string
    tanggal: string
    status: string
    isi: string
    lokasi?: string
    kontak?: string
    gambar?: string
}

const getStatusColor = (status: string): string => {
    switch (status) {
        case "Diproses":
            return "bg-gray-100 text-gray-800"
        case "Selesai":
            return "bg-green-100 text-green-800"
        case "Ditolak":
            return "bg-gray-100 text-gray-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

// Wrapper untuk tooltip agar tidak menulis ulang kode
const TooltipWrapper = ({ children, label }: { children: React.ReactNode, label: string }) => (
    <Tooltip.Provider delayDuration={300}>
        <Tooltip.Root>
            <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content
                    side="top"
                    sideOffset={6}
                    className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                    avoidCollisions
                    collisionPadding={8}
                >
                    {label}
                    <Tooltip.Arrow className="fill-white" width={10} height={5} />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    </Tooltip.Provider>
)

export default function LaporanMasyarakatPage() {
    const [laporanData, setLaporanData] = useState<LaporanItem[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const fetchLaporan = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                const laporan = res.data.data.map((item: LaporanItem) => {
                    const storedStatus = localStorage.getItem(`status-${item.laporan_id}`)
                    return storedStatus ? { ...item, status: storedStatus } : item
                })

                setLaporanData(laporan)
            } catch (error) {
                console.error("Gagal memuat laporan:", error)
                setError("Gagal memuat laporan")
            } finally {
                setLoading(false)
            }
        }

        fetchLaporan()
    }, [])

    const handleStatusChange = (id: number, newStatus: string) => {
        setLaporanData(prev =>
            prev.map(laporan =>
                laporan.laporan_id === id ? { ...laporan, status: newStatus } : laporan
            )
        )
        localStorage.setItem(`status-${id}`, newStatus)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const sortedData = useMemo(
        () => [...laporanData].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()),
        [laporanData]
    )

    const filteredData = useMemo(() => {
        const query = searchQuery.toLowerCase()
        return sortedData.filter(laporan =>
            laporan.nama.toLowerCase().includes(query) ||
            laporan.keluhan.toLowerCase().includes(query) ||
            laporan.deskripsi.toLowerCase().includes(query) ||
            laporan.tanggal.toLowerCase().includes(query) ||
            laporan.status.toLowerCase().includes(query)
        )
    }, [sortedData, searchQuery])

    if (loading) return <p>Memuat laporan...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Laporan Masyarakat</h1>
                <p className="text-muted-foreground">Kelola laporan dan aduan dari masyarakat</p>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Laporan</CardTitle>
                            <CardDescription>Daftar laporan dan aduan dari masyarakat</CardDescription>
                        </div>
                        <SearchComponent searchQuery={searchQuery} onSearchChange={handleSearchChange} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama Pelapor</TableHead>
                                <TableHead>Judul Laporan</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((laporan, index) => (
                                    <TableRow key={laporan.laporan_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{laporan.nama}</TableCell>
                                        <TableCell style={{
                                            maxWidth: 150,          
                                            whiteSpace: 'nowrap',   
                                            overflow: 'hidden',     
                                            textOverflow: 'ellipsis' 
                                        }}>{laporan.keluhan}</TableCell>
                                        <TableCell style={{
                                            maxWidth: 250,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>{laporan.deskripsi}</TableCell>
                                        <TableCell>{laporan.tanggal}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(laporan.status)}>{laporan.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <TooltipWrapper label="Lihat Detail Laporan">
                                                    <LihatLaporanModal
                                                        id={laporan.laporan_id}
                                                        nama={laporan.nama}
                                                        judul={laporan.keluhan}
                                                        kategori={laporan.deskripsi}
                                                        tanggal={laporan.tanggal}
                                                        status={laporan.status}
                                                        isi={laporan.isi}
                                                        lokasi={laporan.lokasi}
                                                        kontak={laporan.kontak}
                                                        gambar={laporan.gambar}
                                                    />

                                                </TooltipWrapper>
                                                <TooltipWrapper label="Ubah Status Laporan">
                                                    <UbahStatusLaporanModal
                                                        id={laporan.laporan_id}
                                                        nama={laporan.nama}
                                                        judul={laporan.keluhan}
                                                        status={laporan.status}
                                                        onStatusChange={handleStatusChange}
                                                    />
                                                </TooltipWrapper>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        Tidak ada data yang sesuai dengan pencarian
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
