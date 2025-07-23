"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Edit, Eye, EyeOff } from "lucide-react";
import axios from "axios";

interface UserItem {
    user_id: number;
    nama: string;
    username: string;
    password: string;
    photo?: string;
    NIK: string;
    alamat: string;
    jenis_kel: string;
    no_hp: string;
    agama: string;
    role: string;
}

interface EditUserModalProps {
    user: UserItem;
    onUpdateUser?: (user: UserItem) => void;
}

export function EditUserModal({ user, onUpdateUser }: EditUserModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<UserItem>({ ...user });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token"); 

            const data = new FormData();
            data.append("nama", formData.nama);
            data.append("username", formData.username);
            if (formData.password) data.append("password", formData.password);
            data.append("NIK", formData.NIK);
            data.append("alamat", formData.alamat);
            data.append("jenis_kel", formData.jenis_kel);
            data.append("no_hp", formData.no_hp);
            data.append("agama", formData.agama);
            data.append("role", formData.role);
            if (selectedFile) data.append("photo", selectedFile);

            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/${formData.user_id}`,
                data,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            );

            const updatedPhoto = selectedFile
                ? await toBase64(selectedFile)
                : formData.photo;

            onUpdateUser?.({ ...formData, photo: updatedPhoto });

            setOpen(false);
        } catch (error) {
            console.error("Gagal update user:", error);
            alert("Gagal memperbarui data.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-amber-100 text-amber-500 hover:bg-amber-500 hover:text-white"
                    size="sm"
                >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Penduduk</DialogTitle>
                    <DialogDescription>Perbarui informasi pengguna</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <FormRow label="Nama" id="nama">
                            <Input
                                id="nama"
                                value={formData.nama}
                                onChange={handleInputChange}
                                required
                            />
                        </FormRow>

                        <FormRow label="Username" id="username">
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </FormRow>

                        <FormRow label="Password" id="password">
                            <div className="relative w-full">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Kosongkan jika tidak ingin ubah"
                                    value={""}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </FormRow>

                        <FormRow label="NIK" id="nik">
                            <Input
                                id="nik"
                                value={formData.NIK}
                                onChange={handleInputChange}
                                required
                            />
                        </FormRow>

                        <FormRow label="No HP" id="no_hp">
                            <Input
                                id="no_hp"
                                value={formData.no_hp}
                                onChange={handleInputChange}
                                required
                            />
                        </FormRow>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Jenis Kelamin</Label>
                            <RadioGroup
                                value={formData.jenis_kel}
                                onValueChange={(value) =>
                                    handleSelectChange("jenis_kel", value)
                                }
                                className="col-span-3 flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Pria" id="edit-l" />
                                    <Label htmlFor="edit-l">Pria</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Wanita" id="edit-p" />
                                    <Label htmlFor="edit-p">Wanita</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <FormRow label="Agama" id="agama">
                            <select
                                id="agama"
                                className="w-full border rounded-md p-2"
                                value={formData.agama}
                                onChange={(e) => handleSelectChange("agama", e.target.value)}
                            >
                                <option value="Islam">Islam</option>
                                <option value="Kristen">Kristen</option>
                                <option value="Katolik">Katolik</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Budha">Budha</option>
                                <option value="Konghucu">Konghucu</option>
                            </select>
                        </FormRow>

                        <FormRow label="Alamat" id="alamat" isTextarea>
                            <Textarea
                                id="alamat"
                                value={formData.alamat}
                                onChange={handleInputChange}
                                required
                            />
                        </FormRow>

                        <FormRow label="Foto" id="photo">
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {selectedFile && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    File dipilih: <strong>{selectedFile.name}</strong>
                                </p>
                            )}
                        </FormRow>

                        <FormRow label="Role" id="role">
                            <select
                                id="role"
                                className="w-full border rounded-md p-2"
                                value={formData.role}
                                onChange={(e) => handleSelectChange("role", e.target.value)}
                            >
                                <option value="penduduk">penduduk</option>
                                <option value="admin">admin</option>
                            </select>
                        </FormRow>
                    </div>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" variant="ghost" disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Komponen Form Row
function FormRow({
    label,
    id,
    children,
    isTextarea = false,
}: {
    label: string;
    id: string;
    children: React.ReactNode;
    isTextarea?: boolean;
}) {
    return (
        <div
            className={`grid grid-cols-4 items-${isTextarea ? "start" : "center"
                } gap-4`}
        >
            <Label htmlFor={id} className="text-right">
                {label}
            </Label>
            <div className="col-span-3">{children}</div>
        </div>
    );
}
