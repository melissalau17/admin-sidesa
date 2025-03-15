import { Button } from "@/components/ui/buttom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Search, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TambahBeritaModal } from "@/components/modals/tambah-berita-modal"

interface BeritaItem {
   id: number
   judul: string
   kategori: string
   tanggal: string
   status: string
}

const beritaData: BeritaItem[] = [
   {
      id: 1,
      judul: "Pembangunan Jembatan Desa Dimulai",
      kategori: "Infrastruktur",
      tanggal: "12 Mar 2025",
      status: "Dipublikasikan",
   },
   {
      id: 2,
      judul: "Hasil Panen Padi Meningkat 20%",
      kategori: "Pertanian",
      tanggal: "10 Mar 2025",
      status: "Dipublikasikan",
   },
   {
      id: 3,
      judul: "Program Vaksinasi Lansia Sukses",
      kategori: "Kesehatan",
      tanggal: "8 Mar 2025",
      status: "Dipublikasikan",
   },
   {
      id: 4,
      judul: "Pelatihan UMKM untuk Warga Desa",
      kategori: "Ekonomi",
      tanggal: "5 Mar 2025",
      status: "Draft",
   },
   {
      id: 5,
      judul: "Persiapan Festival Desa Tahunan",
      kategori: "Budaya",
      tanggal: "1 Mar 2025",
      status: "Draft",
   },
]

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
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold">Berita Desa</h1>
            <p className="text-muted-foreground">Kelola berita dan informasi desa</p>
         </div>
         <TambahBeritaModal />
         </div>

         <Card>
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <div>
               <CardTitle>Daftar Berita</CardTitle>
               <CardDescription>Daftar berita dan informasi desa</CardDescription>
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
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
               </TableRow>
               </TableHeader>
               <TableBody>
               {beritaData.map((berita) => (
                  <TableRow key={berita.id}>
                     <TableCell>{berita.id}</TableCell>
                     <TableCell>{berita.judul}</TableCell>
                     <TableCell>{berita.kategori}</TableCell>
                     <TableCell>{berita.tanggal}</TableCell>
                     <TableCell>
                     <Badge className={getStatusColor(berita.status)}>{berita.status}</Badge>
                     </TableCell>
                     <TableCell className="text-right">
                     <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                           <Eye className="h-4 w-4" />
                           <span className="sr-only">Lihat</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                           <Edit className="h-4 w-4" />
                           <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                           <Trash className="h-4 w-4" />
                           <span className="sr-only">Hapus</span>
                        </Button>
                     </div>
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

