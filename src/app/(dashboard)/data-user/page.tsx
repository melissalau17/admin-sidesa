"use client";

import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TambahUserModal } from "@/components/modals/tambah-user-modal";
import { EditUserModal } from "@/components/modals/edit-user-modal";
import { HapusUserModal } from "@/components/modals/hapus-user-modal";
import { LihatUserModal } from "@/components/modals/lihat-user-modal";
import { SearchComponent } from "@/components/ui/SearchComponent";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface UserItem {
    user_id: number;
    nama: string;
    username: string;
    role: string;
    photo?: string; 
    no_hp: string;
    jenis_kel: string;
    alamat: string;
    agama: string;
    password: string;
    NIK: string;
}

interface UserResponseItem {
    user_id: number;
    nama?: string;
    username?: string;
    role?: string;
    photo?: number[]; 
    no_hp?: string;
    jenis_kel?: string;
    alamat?: string;
    agama?: string;
    password?: string;
    NIK?: string;
}

export default function DataUserPage() {
    const [userData, setUserData] = useState<UserItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { toast } = useToast();

    const totalPages = Math.ceil(userData.length / itemsPerPage);

    const handleAddUser = (newUser: UserItem) => {
        setUserData((prev) => [...prev, newUser]);
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const token = localStorage.getItem("token"); 
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            setUserData((prev) => prev.filter((user) => user.user_id !== id));
        } catch (err) {
            setError("Gagal memuat data berita.");
            console.error("Gagal mengambil data berita", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = (updatedUser: UserItem) => {
        setUserData((prev) =>
            prev.map((user) =>
                user.user_id === updatedUser.user_id ? updatedUser : user
            )
        );
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token"); 

                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const users = Array.isArray(res.data.data)
                    ? res.data.data
                    : res.data.data.users || [];

                const mapped: UserItem[] = users.map((item: UserResponseItem) => {
                    let base64Photo: string | undefined;

                    if (item.photo) {
                        try {
                            const byteArray: number[] = item.photo;
                            const mime =
                                byteArray[0] === 0xff && byteArray[1] === 0xd8
                                    ? "image/jpeg"
                                    : byteArray[0] === 0x89 && byteArray[1] === 0x50
                                        ? "image/png"
                                        : "image/jpeg";

                            const binary = byteArray
                                .map((byte) => String.fromCharCode(byte))
                                .join("");
                            const base64 = btoa(binary);

                            base64Photo = `data:${mime};base64,${base64}`;
                        } catch (error) {
                            console.error("Error converting photo to base64:", error);
                        }
                    }

                    return {
                        user_id: item.user_id,
                        nama: item.nama || "-",
                        username: item.username || "-",
                        role: item.role || "-",
                        photo: base64Photo,
                        no_hp: item.no_hp || "-",
                        jenis_kel: item.jenis_kel || "-",
                        alamat: item.alamat || "-",
                        agama: item.agama || "-",
                        password: item.password || "-",
                        NIK: item.NIK || "-",
                    };
                });

                setUserData(mapped);
            } catch (error) {
                console.error("Gagal memuat data pengguna:", error);
                toast({
                    title: "Error",
                    description: "Gagal memuat data pengguna dari server.",
                    variant: "destructive",
                });
            }
        };

        fetchUsers();
    }, [toast]);

    const filteredData = userData.filter((user) => {
        const q = searchQuery.toLowerCase();
        return (
            user.nama.toLowerCase().includes(q) || user.NIK.toLowerCase().includes(q)
        );
    });

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Data Penduduk</h1>
                    <p className="text-muted-foreground">Kelola data penduduk sistem</p>
                </div>
                <TambahUserModal onAddUser={handleAddUser} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {loading && <p className="text-gray-500 text-sm">Memuat data...</p>}
            {!loading && (
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>Daftar Penduduk</CardTitle>
                                <CardDescription>
                                    Tampilkan foto, nama, NIK, dan role
                                </CardDescription>
                            </div>
                            <SearchComponent
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                                placeholder="Cari Penduduk..."
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">
                        <div className="min-w-[900px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Foto</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((user, idx) => (
                                            <TableRow key={user.user_id}>
                                                <TableCell>
                                                    {(currentPage - 1) * itemsPerPage + idx + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <Avatar className="h-8 w-8">
                                                        {user.photo ? (
                                                            <AvatarImage src={user.photo} alt={user.nama} />
                                                        ) : null}
                                                        <AvatarFallback>
                                                            {user.nama ? user.nama[0].toUpperCase() : "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>

                                                <TableCell>{user.nama}</TableCell>
                                                <TableCell>{user.NIK}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <LihatUserModal user={user} />
                                                        <EditUserModal
                                                            user={user}
                                                            onUpdateUser={handleUpdateUser}
                                                        />
                                                        <HapusUserModal
                                                            id={user.user_id}
                                                            nama={user.nama}
                                                            onDeleteUser={handleDeleteUser}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-4">
                                                Tidak ada data ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-center items-center gap-4 mt-4">
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                Sebelumnya
                            </Button>
                            <span>
                                Halaman {currentPage} dari {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
