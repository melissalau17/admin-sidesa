"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/buttom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function TambahTransaksiModal() {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [date, setDate] = useState<Date>(new Date())
   const { toast } = useToast()

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      // Simulasi proses penyimpanan
      setTimeout(() => {
         setIsLoading(false)
         setOpen(false)
         toast({
         title: "Berhasil",
         description: "Transaksi berhasil ditambahkan",
         })
      }, 1000)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
         <Button>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="mr-2 h-4 w-4"
            >
               <path d="M5 12h14"></path>
               <path d="M12 5v14"></path>
            </svg>
            Tambah Transaksi
         </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px]">
         <DialogHeader>
            <DialogTitle>Tambah Transaksi Keuangan</DialogTitle>
            <DialogDescription>Tambahkan transaksi keuangan desa baru</DialogDescription>
         </DialogHeader>
         <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
               <Label className="text-right">Jenis Transaksi</Label>
               <RadioGroup defaultValue="pemasukan" className="col-span-3">
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="pemasukan" id="pemasukan" />
                     <Label htmlFor="pemasukan">Pemasukan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="pengeluaran" id="pengeluaran" />
                     <Label htmlFor="pengeluaran">Pengeluaran</Label>
                  </div>
               </RadioGroup>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="keterangan" className="text-right">
                  Keterangan
               </Label>
               <Input id="keterangan" placeholder="Masukkan keterangan transaksi" className="col-span-3" required />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="kategori" className="text-right">
                  Kategori
               </Label>
               <Select required>
                  <SelectTrigger id="kategori" className="col-span-3">
                     <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="dana-desa">Dana Desa</SelectItem>
                     <SelectItem value="retribusi">Retribusi</SelectItem>
                     <SelectItem value="bantuan">Bantuan</SelectItem>
                     <SelectItem value="infrastruktur">Infrastruktur</SelectItem>
                     <SelectItem value="operasional">Operasional</SelectItem>
                     <SelectItem value="gaji">Gaji</SelectItem>
                     <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
               </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="tanggal" className="text-right">
                  Tanggal
               </Label>
               <div className="col-span-3">
                  <Popover>
                     <PopoverTrigger asChild>
                     <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                     >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                     </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0">
                     <Calendar 
                        mode="single"
                        selected={date}
                        onSelect={(date: Date | undefined) => {
                           if (date) setDate(date)
                        }}
                        initialFocus
                        className="rounded-md border shadow"
                        classNames={{
                           day_selected: "bg-primary text-white",
                           day_today: "bg-accent text-accent-foreground",
                        }}/>
                     </PopoverContent>
                  </Popover>
               </div>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="jumlah" className="text-right">
                  Jumlah (Rp)
               </Label>
               <Input
                  id="jumlah"
                  placeholder="Masukkan jumlah"
                  className="col-span-3"
                  required
                  type="number"
                  min="0"
                  step="1000"
               />
               </div>
               <div className="grid grid-cols-4 items-start gap-4">
               <Label htmlFor="catatan" className="text-right pt-2">
                  Catatan
               </Label>
               <Textarea id="catatan" placeholder="Masukkan catatan tambahan (opsional)" className="col-span-3" />
               </div>
            </div>
            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
               Batal
               </Button>
               <Button type="submit" disabled={isLoading}>
               {isLoading ? "Menyimpan..." : "Simpan"}
               </Button>
            </DialogFooter>
         </form>
         </DialogContent>
      </Dialog>
   )
}
