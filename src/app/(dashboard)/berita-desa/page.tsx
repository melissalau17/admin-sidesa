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

interface BeritaApiItem {
    berita_id: number
    judul: string
    kategori: string
    tanggal: string
    status: string
    konten: string
}

// const initialBeritaData: BeritaItem[] = [
//     {
//         id: 1,
//         judul: "Pembangunan Jembatan Desa Dimulai",
//         kategori: "Infrastruktur",
//         tanggal: "12 Mar 2025",
//         status: "Dipublikasikan",
//         konten:
//             "Pembangunan jembatan penghubung antar dusun telah dimulai pada hari Senin, 10 Maret 2025. Jembatan ini akan menghubungkan Dusun Sukamaju dan Dusun Harapan Jaya yang selama ini terpisah oleh sungai.\n\nProyek ini dibiayai oleh dana desa dan diperkirakan akan selesai dalam waktu 3 bulan. Jembatan sepanjang 15 meter ini akan mempermudah mobilitas warga dan meningkatkan aktivitas ekonomi antar dusun.",
//     },
//     {
//         id: 2,
//         judul: "Hasil Panen Padi Meningkat 20%",
//         kategori: "Pertanian",
//         tanggal: "10 Mar 2025",
//         status: "Dipublikasikan",
//         konten:
//             "Hasil panen padi di desa kita pada musim tanam tahun ini mengalami peningkatan sebesar 20% dibandingkan tahun lalu. Peningkatan ini berkat program intensifikasi pertanian yang telah dijalankan sejak tahun lalu.\n\nProgram tersebut meliputi penyuluhan teknik bertani modern, bantuan bibit unggul, dan perbaikan sistem irigasi. Petani desa kini bisa menikmati hasil panen yang lebih melimpah dan berkualitas lebih baik.",
//     },
//     {
//         id: 3,
//         judul: "Program Vaksinasi Lansia Sukses",
//         kategori: "Kesehatan",
//         tanggal: "8 Mar 2025",
//         status: "Dipublikasikan",
//         konten:
//             "Program vaksinasi untuk warga lansia di desa kita telah berhasil mencapai target 95% dari total populasi lansia. Program yang berlangsung selama dua minggu ini mendapat sambutan positif dari masyarakat.\n\nTim kesehatan desa bekerja sama dengan Puskesmas setempat melakukan kunjungan dari rumah ke rumah untuk memastikan semua lansia mendapatkan vaksin. Hal ini merupakan bagian dari upaya meningkatkan kualitas kesehatan masyarakat desa.",
//     },
//     {
//         id: 4,
//         judul: "Pelatihan UMKM untuk Warga Desa",
//         kategori: "Ekonomi",
//         tanggal: "5 Mar 2025",
//         status: "Draft",
//         konten:
//             "Pemerintah desa akan mengadakan pelatihan UMKM bagi warga desa pada tanggal 15-17 Maret 2025. Pelatihan ini bertujuan untuk meningkatkan kapasitas warga dalam mengelola usaha kecil dan menengah.\n\nMateri yang akan diberikan meliputi manajemen keuangan sederhana, strategi pemasaran produk, dan pemanfaatan media sosial untuk promosi. Pendaftaran dibuka mulai tanggal 6 Maret 2025 di kantor desa.",
//     },
//     {
//         id: 5,
//         judul: "Persiapan Festival Desa Tahunan",
//         kategori: "Budaya",
//         tanggal: "1 Mar 2025",
//         status: "Draft",
//         konten:
//             "Persiapan Festival Desa Tahunan telah dimulai. Festival yang akan diselenggarakan pada bulan April mendatang ini akan menampilkan berbagai kesenian dan budaya lokal desa kita.\n\nPanitia festival telah dibentuk dan mulai melakukan koordinasi dengan berbagai kelompok seni di desa. Festival ini diharapkan dapat menjadi ajang promosi potensi desa sekaligus melestarikan budaya lokal yang kita miliki.",
//     },
// ]

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
    const [editModalOpenId, setEditModalOpenId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { toast } = useToast()

    useEffect(() => {
        const fetchBeritas = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from localStorage or cookie
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const mappedData: BeritaApiItem[] = res.data.data.map((item: BeritaApiItem) => ({
                    id: item.berita_id,
                    judul: item.judul,
                    kategori: item.kategori,
                    tanggal: item.tanggal ?? "",
                    status: item.status,
                    konten: item.konten ?? "", // pastikan backend memang "konten" bukan "kontent"
                }));


                setBeritaData(mappedData);
            } catch (err) {
                console.error("Gagal mengambil data berita", err);
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
            konten: string
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
                                                                <LihatBeritaModal id={berita.berita_id} />
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

                                                {/* Tambahkan Tooltip untuk Tombol Ubah Status */}
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

                                                {/* Outside the table but inside the same map loop */}
                                                <EditBeritaModal
                                                    id={berita.berita_id}
                                                    judul={berita.judul}
                                                    kategori={berita.kategori}
                                                    status={berita.status}
                                                    konten={berita.konten}
                                                    open={editModalOpenId === berita.berita_id}
                                                    onOpenChange={(open) => {
                                                        if (!open) setEditModalOpenId(null)
                                                    }}
                                                    onBeritaUpdate={handleBeritaUpdate}
                                                />


                                                {/* Tambahkan Tooltip untuk Tombol Delete */}
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
                </CardContent>
            </Card>
        </div>
    )
}