"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";

interface HapusUserModalProps {
  id: number;
  nama: string;
  onDeleteUser: (id: number) => Promise<void> | void; // biar fleksibel (sync/async)
}

export function HapusUserModal({ id, nama, onDeleteUser }: HapusUserModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDeleteUser(id); // support async API call
      toast({
        title: "Berhasil",
        description: `User "${nama}" berhasil dihapus`,
      });
      setOpen(false);
    } catch (err) {
      console.error("Gagal hapus user:", err);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white text-black shadow-lg rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">Hapus User</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Apakah Anda yakin ingin menghapus user{" "}
            <span className="font-semibold">"{nama}"</span>? Tindakan ini tidak dapat
            dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
