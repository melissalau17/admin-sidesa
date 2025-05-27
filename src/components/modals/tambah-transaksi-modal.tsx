"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/buttom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function TambahTransaksiModal() {
   const [open, setOpen] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [date] = useState<Date>(new Date())
   const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false) // State untuk kontrol modal tanggal
   const { toast } = useToast()

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

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
            <Button className="w-min bg-[#004D40] hover:bg-[#00695C] text-white py-2 rounded-md">
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
                  className="mr-2 h-4 w-4">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
               </svg>
               Tambah Transaksi
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Tambah Transaksi Keuangan</DialogTitle>
               <DialogDescription>Tambahkan transaksi keuangan desa baru</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
               <div className="grid gap-4 py-4">
                  {/* Jenis Transaksi */}
                  <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                     <Label className="sm:text-right">Jenis Transaksi</Label>
                     <RadioGroup defaultValue="pemasukan" className="sm:col-span-3 space-y-2">
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

                  {/* Keterangan */}
                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                     <Label htmlFor="keterangan" className="sm:text-right">Keterangan</Label>
                     <Input id="keterangan" placeholder="Masukkan keterangan transaksi" className="col-span-3" required />
                  </div>

                  {/* Kategori */}
                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                     <Label htmlFor="kategori" className="sm:text-right">Kategori</Label>
                     <Select required>
                        <SelectTrigger id="kategori" className="col-span-3 border-b border-gray-300">
                           <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="dana-desa" className="hover:bg-[#129990]">Dana Desa</SelectItem>
                           <SelectItem value="retribusi" className="hover:bg-[#129990]">Retribusi</SelectItem>
                           <SelectItem value="bantuan" className="hover:bg-[#129990]">Bantuan</SelectItem>
                           <SelectItem value="infrastruktur" className="hover:bg-[#129990]">Infrastruktur</SelectItem>
                           <SelectItem value="operasional" className="hover:bg-[#129990]">Operasional</SelectItem>
                           <SelectItem value="gaji" className="hover:bg-[#129990]">Gaji</SelectItem>
                           <SelectItem value="lainnya" className="hover:bg-[#129990]">Lainnya</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  {/* Tanggal */}
                  <div className="lex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                     <Label htmlFor="tanggal" className="sm:text-right">Tanggal</Label>
                     <div className="col-span-3">
                        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                           <PopoverTrigger asChild>
                              <Button
                                 variant={"default"}
                                 onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                 className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                              >
                                 <CalendarIcon className="mr-2 h-4 w-4" />
                                 {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                              </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0">
                           </PopoverContent>
                        </Popover>
                     </div>
                  </div>

                  {/* Jumlah */}
                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                     <Label htmlFor="jumlah" className="sm:text-right">Jumlah (Rp)</Label>
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

                  {/* Catatan */}
                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                     <Label htmlFor="catatan" className="sm:text-right">Catatan</Label>
                     <Textarea id="catatan" placeholder="Masukkan catatan tambahan (opsional)" className="col-span-3 border-b border-gray-300" />
                  </div>
               </div>
               <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                  <Button type="button" variant="destructive" onClick={() => setOpen(false)}>Batal</Button>
                  <Button type="submit" variant="ghost" disabled={isLoading}>
                     {isLoading ? "Menyimpan..." : "Simpan"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   )
}
