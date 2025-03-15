import { Button } from "../../../components/ui/buttom" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TambahSuratModal } from "@/components/modals/tambah-surat-modal" // Perbaikan: default import jika memang diekspor default

interface SuratItem {
   id: number
   nama: string
   jenis: string
   tanggal: string
   status: string
}

const suratData: SuratItem[] = [
   {
      id: 1,
      nama: "Ahmad Suparjo",
      jenis: "Surat Keterangan Domisili",
      tanggal: "12 Mar 2025",
      status: "Menunggu",
   },
   {
      id: 2,
      nama: "Siti Aminah",
      jenis: "Surat Keterangan Usaha",
      tanggal: "10 Mar 2025",
      status: "Diproses",
   },
   {
      id: 3,
      nama: "Budi Santoso",
      jenis: "Surat Keterangan Tidak Mampu",
      tanggal: "8 Mar 2025",
      status: "Selesai",
   },
   {
      id: 4,
      nama: "Dewi Lestari",
      jenis: "Surat Pengantar KTP",
      tanggal: "5 Mar 2025",
      status: "Selesai",
   },
   {
      id: 5,
      nama: "Joko Widodo",
      jenis: "Surat Keterangan Domisili",
      tanggal: "1 Mar 2025",
      status: "Selesai",
   },
]

const getStatusColor = (status: string): string => {
   switch (status) {
      case "Menunggu":
         return "bg-yellow-100 text-yellow-800"
      case "Diproses":
         return "bg-blue-100 text-blue-800"
      case "Selesai":
         return "bg-green-100 text-green-800"
      default:
         return "bg-gray-100 text-gray-800"
   }
}

export default function KelolaSuratPage() {
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold">Kelola Surat</h1>
               <p className="text-muted-foreground">Kelola permohonan surat dari masyarakat</p>
            </div>
            <TambahSuratModal />
         </div>

         <Card>
            <CardHeader className="pb-2">
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Daftar Permohonan Surat</CardTitle>
                     <CardDescription>Daftar permohonan surat yang masuk</CardDescription>
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
                        <TableHead>Nama</TableHead>
                        <TableHead>Jenis Surat</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {suratData.map((surat) => (
                        <TableRow key={surat.id}>
                           <TableCell>{surat.id}</TableCell>
                           <TableCell>{surat.nama}</TableCell>
                           <TableCell>{surat.jenis}</TableCell>
                           <TableCell>{surat.tanggal}</TableCell>
                           <TableCell>
                              <Badge className={getStatusColor(surat.status)}>{surat.status}</Badge>
                           </TableCell>
                           <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                 <FileText className="h-4 w-4" />
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
