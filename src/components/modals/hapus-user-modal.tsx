"use client";

import { useState } from "react";
import { Button } from "@/components/ui/buttom";
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
  onDeleteUser: (id: number) => void;
}

export function HapusUserModal({
  id,
  nama,
  onDeleteUser,
}: HapusUserModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      onDeleteUser(id);
      setIsLoading(false);
      setOpen(false);
      toast({
        title: "Berhasil",
        description: "Penduduk berhasil dihapus",
      });
    }, 1000);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          className="text-red-500 bg-red-50 hover:text-white hover:bg-red-500"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white text-black shadow-lg rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">
            Hapus User
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Apakah Anda yakin ingin menghapus user{" "}
            <span className="font-semibold">"{nama}"</span>? Tindakan ini tidak
            dapat dibatalkan.
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
