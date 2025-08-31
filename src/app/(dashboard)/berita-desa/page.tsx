"use client"

import { useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash } from "lucide-react"
import { TambahBeritaModal } from "@/components/modals/tambah-berita-modal"
import { LihatBeritaModal } from "@/components/modals/lihat-berita-modal"
import { EditBeritaModal } from "@/components/modals/edit-berita-modal"
import { useToast } from "@/hooks/use-toast"
import { SearchComponent } from "@/components/ui/SearchComponent"
import * as Tooltip from "@radix-ui/react-tooltip"
import axios from "axios"
import { useEffect } from "react"
import { DialogContent } from "@/components/ui/dialog" // Import DialogContent for the warning fix

interface BeritaApiItem {
    berita_id: number
    judul: string
    kategori: string
    tanggal: string
    status: string
    kontent: string
}

const getStatusColor = (status: string): string => {
    switch (status) {
        case "Dipublikasikan":
            return "bg-green-100 text-green-800"
        case "Draft":
            return "bg-gray-100 text-gray-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

export default function BeritaDesaPage() {
    const [beritaData, setBeritaData] = useState<BeritaApiItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editModalOpenId, setEditModalOpenId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { toast } = useToast()

    useEffect(() => {
        const fetchBeritas = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // **FIX:** Check if res.data.data is an array before mapping
                if (Array.isArray(res.data.data)) {
                    const mappedData: BeritaApiItem[] = res.data.data.map((item: BeritaApiItem) => ({
                        berita_id: item.berita_id,
                        judul: item.judul,
                        kategori: item.kategori,
                        tanggal: item.tanggal ?? "",
                        status: item.status,
                        konten: item.kontent ?? "",
                    }));
                    setBeritaData(mappedData);
                } else {
                    // Handle the case where the API returns a non-array value
                    console.error("API response data is not an array:", res.data.data);
                    setError("Data berita tidak valid.");
                }
            } catch (err) {
                setError("Gagal memuat data berita.");
                console.error("Gagal mengambil data berita", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBeritas();
    }, []);


    // Function to handle search input changes
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    // Function to update berita
    const handleBeritaUpdate = (
        id: number,
        updatedBerita: {
            judul: string
            kategori: string
            status: string
            kontent: string
        },
    ) => {
        setBeritaData((prevData) => prevData.map((berita) => (berita.berita_id === id ? { ...berita, ...updatedBerita } : berita)))
    }

    const handleDirectDelete = async (id?: number) => {
        if (!id) {
            toast({
                title: "Gagal",
                description: "ID berita tidak ditemukan",
                variant: "destructive",
            })
            return
        }

        try {
            const token = localStorage.getItem("token")
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setBeritaData((prevData) => prevData.filter((berita) => berita.berita_id !== id))

            toast({
                title: "Berhasil",
                description: "Berita berhasil dihapus",
            })
        } catch (error) {
            console.error("Gagal menghapus berita:", error)
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menghapus berita",
                variant: "destructive",
            })
        }
    }


    // Filter data based on search query
    const filteredData = beritaData.filter((berita) => {
        const query = searchQuery.toLowerCase()
        return (
            berita.judul.toLowerCase().includes(query) ||
            berita.kategori.toLowerCase().includes(query) ||
            berita.tanggal.toLowerCase().includes(query) ||
            berita.status.toLowerCase().includes(query)
        )
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Berita Desa</h1>
                    <p className="text-muted-foreground">Kelola berita dan informasi desa</p>
                </div>
                <Tooltip.Provider delayDuration={200}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <div className="relative inline-block">
                                <TambahBeritaModal />
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content
                                side="bottom"
                                sideOffset={6}
                                className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                avoidCollisions
                                collisionPadding={8}
                            >
                                Tambah Berita Baru
                                <Tooltip.Arrow className="fill-white" width={10} height={5} />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Berita</CardTitle>
                            <CardDescription>Daftar berita dan informasi desa</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <SearchComponent
                                    searchQuery={searchQuery}
                                    onSearchChange={handleSearchChange}
                                    placeholder="Cari berita..."
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* **FIX:** Conditional rendering for loading, error, and data */}
                    {loading ? (
                        <p className="text-gray-500 text-center py-4">Memuat data...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center py-4">{error}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((berita, index) => (
                                        // **FIX:** Ensure key is always valid
                                        <TableRow key={berita.berita_id ?? `fallback-${index}`}>
                                            <TableCell>{berita.berita_id}</TableCell>
                                            <TableCell>{berita.judul}</TableCell>
                                            <TableCell>{berita.kategori}</TableCell>
                                            <TableCell>{berita.tanggal}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(berita.status)}>{berita.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Tooltip.Provider delayDuration={300}>
                                                        <Tooltip.Root>
                                                            <Tooltip.Trigger asChild>
                                                                <div className="relative inline-block">
                                                                    <LihatBeritaModal berita_id={berita.berita_id} />
                                                                </div>
                                                            </Tooltip.Trigger>
                                                            <Tooltip.Portal>
                                                                <Tooltip.Content
                                                                    side="top"
                                                                    sideOffset={6}
                                                                    className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                                                    avoidCollisions
                                                                    collisionPadding={8}
                                                                >
                                                                    Lihat Detail Berita
                                                                    <Tooltip.Arrow className="fill-white" width={10} height={5} />
                                                                </Tooltip.Content>
                                                            </Tooltip.Portal>
                                                        </Tooltip.Root>
                                                    </Tooltip.Provider>

                                                    <Tooltip.Provider delayDuration={300}>
                                                        <Tooltip.Root>
                                                            <Tooltip.Trigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setEditModalOpenId(berita.berita_id)}
                                                                >
                                                                    ✏️
                                                                </Button>
                                                            </Tooltip.Trigger>
                                                            <Tooltip.Portal>
                                                                <Tooltip.Content
                                                                    side="top"
                                                                    sideOffset={6}
                                                                    className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                                                    avoidCollisions
                                                                    collisionPadding={8}
                                                                >
                                                                    Ubah Status Berita
                                                                    <Tooltip.Arrow className="fill-white" width={10} height={5} />
                                                                </Tooltip.Content>
                                                            </Tooltip.Portal>
                                                        </Tooltip.Root>
                                                    </Tooltip.Provider>
                                                    <EditBeritaModal
                                                        id={berita.berita_id}
                                                        judul={berita.judul}
                                                        kategori={berita.kategori}
                                                        status={berita.status}
                                                        kontent={berita.kontent}
                                                        open={editModalOpenId === berita.berita_id}
                                                        onOpenChange={(open) => {
                                                            if (!open) setEditModalOpenId(null)
                                                        }}
                                                        onBeritaUpdate={handleBeritaUpdate}
                                                    />


                                                    <Tooltip.Provider delayDuration={300}>
                                                        <Tooltip.Root>
                                                            <Tooltip.Trigger asChild>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleDirectDelete(berita.berita_id)}
                                                                    className="text-red-500 bg-red-50 hover:text-red-50 hover:bg-red-500"
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                    <span className="sr-only">Hapus</span>
                                                                </Button>
                                                            </Tooltip.Trigger>
                                                            <Tooltip.Portal>
                                                                <Tooltip.Content
                                                                    side="top"
                                                                    sideOffset={6}
                                                                    className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded shadow-md z-50"
                                                                    avoidCollisions
                                                                    collisionPadding={8}
                                                                >
                                                                    Hapus Berita
                                                                    <Tooltip.Arrow className="fill-white" width={10} height={5} />
                                                                </Tooltip.Content>
                                                            </Tooltip.Portal>
                                                        </Tooltip.Root>
                                                    </Tooltip.Provider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow key="no-data">
                                        <TableCell colSpan={6} className="text-center py-4">
                                            Tidak ada data yang sesuai dengan pencarian
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}