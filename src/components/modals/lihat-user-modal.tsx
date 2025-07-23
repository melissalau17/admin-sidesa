"use client";

import { useState } from "react";
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
import { Eye, ClipboardCheck, Clipboard } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

interface LihatUserModalProps {
  user: UserItem;
}

export function LihatUserModal({ user }: LihatUserModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shortPassword = `${user.password.substring(0, 6)}...`;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(user.password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white"
          size="sm"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Lihat</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] w-full p-4">
        <DialogHeader>
          <DialogTitle className="text-center text-base">
            Detail Pengguna
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            Informasi lengkap pengguna
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 px-2">
          {/* Avatar dan Nama */}
          <div className="flex flex-col items-center mb-4 text-center">
            <Avatar className="h-20 w-20 mb-2 bg-amber-200">
              <AvatarImage
                src={user.photo || "/placeholder.svg"}
                alt={user.nama}
              />
              <AvatarFallback className="text-xl">
                {user.nama.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-sm font-semibold">{user.nama}</h2>
            <p className="text-xs text-muted-foreground">ID: {user.user_id}</p>
          </div>

          {/* Informasi Pengguna */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <InfoItem label="NIK" value={user.NIK} />
            <InfoItem label="Username" value={user.username} />
            <InfoItem
              label="Password"
              value={shortPassword}
              icon={
                <button
                  onClick={handleCopyPassword}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                  title="Salin password"
                >
                  {copied ? (
                    <ClipboardCheck className="w-3 h-3" />
                  ) : (
                    <Clipboard className="w-3 h-3" />
                  )}
                </button>
              }
            />
            <InfoItem label="Jenis Kelamin" value={user.jenis_kel} />
            <InfoItem label="No. HP" value={user.no_hp} />
            <InfoItem label="Agama" value={user.agama} />
            <InfoItem label="Role" value={user.role} />
          </div>

          {/* Alamat */}
          <div className="mt-4">
            <p className="text-muted-foreground font-medium mb-1 text-xs">
              Alamat
            </p>
            <div className="p-2 border rounded-md bg-gray-50 text-xs leading-tight">
              {user.alamat}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border rounded px-2 py-1 bg-muted/40">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-muted-foreground font-medium">{label}</span>
        {icon}
      </div>
      <span className="break-words font-mono">{value}</span>
    </div>
  );
}
