"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface TambahUserModalProps {
  trigger?: React.ReactNode;
  onAddUser?: (user: any) => void; // optionally pass newly added user back to parent
}

interface FormData {
  nama: string;
  username: string;
  password: string;
  photo: string;
  NIK: string;
  alamat: string;
  jenis_kel: string;
  no_hp: string;
  agama: string;
  role: string;
}

export function TambahUserModal({ trigger, onAddUser }: TambahUserModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    username: "",
    password: "",
    photo: "",
    NIK: "",
    alamat: "",
    jenis_kel: "",
    no_hp: "",
    agama: "",
    role: "penduduk",
  });

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, photo: base64 }));
    }
  };

  const validateInput = () => {
    const requiredFields: (keyof FormData)[] = [
      "nama",
      "username",
      "password",
      "NIK",
      "no_hp",
      "alamat",
      "jenis_kel",
      "agama",
      "role",
      "photo",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return `Field "${field}" wajib diisi.`;
      }
    }

    if (formData.password.length < 6) {
      return "Password minimal 6 karakter.";
    }

    if (!/^\d{16}$/.test(formData.NIK)) {
      return "NIK harus 16 digit angka.";
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateInput();
    if (error) {
      alert(error);
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (onAddUser) {
        onAddUser({ ...formData, user_id: data.user_id });
      }

      // Reset
      setFormData({
        nama: "",
        username: "",
        password: "",
        photo: "",
        NIK: "",
        alamat: "",
        jenis_kel: "",
        no_hp: "",
        agama: "",
        role: "penduduk",
      });

      setOpen(false);
    } catch (err) {
      console.error("Gagal menambahkan user:", err);
      alert("Terjadi kesalahan saat menyimpan user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="ghost">
            <UserPlus className="mr-2 h-4 w-4" /> Tambah Penduduk
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah User Baru</DialogTitle>
          <DialogDescription>
            Lengkapi data pengguna dengan benar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="text-sm space-y-3 py-2">
          {[
            ["nama", "Nama Lengkap"],
            ["username", "Username"],
            ["password", "Password", "password"],
            ["NIK", "NIK"],
            ["no_hp", "No. HP"],
          ].map(([id, label, type = "text"]) => (
            <div
              key={id}
              className="grid grid-cols-[120px_1fr] items-center gap-2"
            >
              <Label htmlFor={id} className="text-right">
                {label}
              </Label>
              <Input
                id={id}
                type={type}
                value={formData[id as keyof FormData] as string}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}

          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <Label className="text-right">Jenis Kelamin</Label>
            <RadioGroup
              value={formData.jenis_kel}
              onValueChange={(val) =>
                handleSelectChange("jenis_kel", val)
              }
              className="flex gap-6"
            >
              {["Pria", "Wanita"].map((val) => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem value={val} id={val} />
                  <Label htmlFor={val}>{val}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-start gap-2">
            <Label htmlFor="alamat" className="text-right pt-2">
              Alamat
            </Label>
            <Textarea
              id="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <Label htmlFor="photo" className="text-right">
              Foto
            </Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <Label className="text-right">Agama</Label>
            <Select
              value={formData.agama}
              onValueChange={(val) => handleSelectChange("agama", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Agama" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Islam",
                  "Kristen Protestan",
                  "Katolik",
                  "Hindu",
                  "Buddha",
                  "Khonghucu",
                  "Kepercayaan",
                ].map((agama) => (
                  <SelectItem key={agama} value={agama}>
                    {agama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <Label className="text-right">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => handleSelectChange("role", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="penduduk">penduduk</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="destructive" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
