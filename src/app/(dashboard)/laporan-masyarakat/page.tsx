import { Button } from "@/components/ui/buttom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface LaporanItem {
   id: number
   nama: string
   judul: string
   kategori: string
   tanggal: string
   status: string
}

const laporanData: LaporanItem[] = [
   {
      id: 1,
      nama: "Agus Setiawan",
      judul: "Jalan Rusak di RT 03",
      kategori: "Infrastruktur",
      tanggal: "11 Mar 2025",
      status: "Belum Direspon",
   },
   {
      id: 2,
      nama: "Rina Wati",
      judul: "Lampu Jalan Mati di Perempatan",
      kategori: "Infrastruktur",
      tanggal: "9 Mar 2025",
      status: "Diproses",
   },
   {
      id: 3,
      nama: "Hendra Gunawan",
      judul: "Sampah Menumpuk di Pasar",
      kategori: "Lingkungan",
      tanggal: "7 Mar 2025",
      status: "Selesai",
   },
   {
      id: 4,
      nama: "Sri Wahyuni",
      judul: "Kegiatan Mencurigakan di Rumah Kosong",
      kategori: "Keamanan",
      tanggal: "5 Mar 2025",
      status: "Diproses",
   },
   {
      id: 5,
      nama: "Dedi Kurniawan",
      judul: "Saluran Air Tersumbat",
      kategori: "Lingkungan",
      tanggal: "2 Mar 2025",
      status: "Selesai",
   },
]

const getStatusColor = (status: string): string => {
   switch (status) {
      case "Belum Direspon":
         return "bg-red-100 text-red-800"
      case "Diproses":
         return "bg-blue-100 text-blue-800"
      case "Selesai":
         return "bg-green-100 text-green-800"
      default:
         return "bg-gray-100 text-gray-800"
   }
}

export default function LaporanMasyarakatPage() {
   return (
      <div className="space-y-6">
         <div>
         <h1 className="text-2xl font-bold">Laporan Masyarakat</h1>
         <p className="text-muted-foreground">Kelola laporan dan aduan dari masyarakat</p>
         </div>

         <Card>
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <div>
               <CardTitle>Daftar Laporan</CardTitle>
               <CardDescription>Daftar laporan dan aduan dari masyarakat</CardDescription>
               </div>
               <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Cari..." className="pl-8 w-[250px]" />
               </div>
               </div>
            </div>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
               <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Pelapor</TableHead>
                  <TableHead>Judul Laporan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
               </TableRow>
               </TableHeader>
               <TableBody>
               {laporanData.map((laporan) => (
                  <TableRow key={laporan.id}>
                     <TableCell>{laporan.id}</TableCell>
                     <TableCell>{laporan.nama}</TableCell>
                     <TableCell>{laporan.judul}</TableCell>
                     <TableCell>{laporan.kategori}</TableCell>
                     <TableCell>{laporan.tanggal}</TableCell>
                     <TableCell>
                     <Badge className={getStatusColor(laporan.status)}>{laporan.status}</Badge>
                     </TableCell>
                     <TableCell className="text-right">
                     <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Lihat</span>
                     </Button>
                     </TableCell>
                  </TableRow>
               ))}
               </TableBody>
            </Table>
         </CardContent>
         </Card>
      </div>
   )
}

