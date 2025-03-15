import { Button } from "@/components/ui/buttom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TambahTransaksiModal } from "@/components/modals/tambah-transaksi-modal"

interface KeuanganItem {
   id: number
   keterangan: string
   tanggal: string
   jenis: string
   jumlah: string
}

const keuanganData: KeuanganItem[] = [
   {
      id: 1,
      keterangan: "Dana Desa",
      tanggal: "1 Mar 2025",
      jenis: "Pemasukan",
      jumlah: "Rp 25,000,000",
   },
   {
      id: 2,
      keterangan: "Pembangunan Jembatan",
      tanggal: "5 Mar 2025",
      jenis: "Pengeluaran",
      jumlah: "Rp 15,000,000",
   },
   {
      id: 3,
      keterangan: "Retribusi Pasar",
      tanggal: "8 Mar 2025",
      jenis: "Pemasukan",
      jumlah: "Rp 5,000,000",
   },
   {
      id: 4,
      keterangan: "Gaji Perangkat Desa",
      tanggal: "10 Mar 2025",
      jenis: "Pengeluaran",
      jumlah: "Rp 12,000,000",
   },
   {
      id: 5,
      keterangan: "Bantuan Provinsi",
      tanggal: "12 Mar 2025",
      jenis: "Pemasukan",
      jumlah: "Rp 15,000,000",
   },
]

const getJenisColor = (jenis: string): string => {
   switch (jenis) {
      case "Pemasukan":
         return "bg-green-100 text-green-800"
      case "Pengeluaran":
         return "bg-red-100 text-red-800"
      default:
         return "bg-gray-100 text-gray-800"
   }
}

export default function LaporanKeuanganPage() {
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
            <p className="text-muted-foreground">Kelola laporan keuangan desa</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline">
               <Download className="mr-2 h-4 w-4" />
               Unduh Laporan
            </Button>
            <TambahTransaksiModal />
         </div>
         </div>

         <div className="grid gap-4 md:grid-cols-3">
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-green-600">Rp 45,000,000</div>
               <p className="text-xs text-muted-foreground mt-1">Bulan Maret 2025</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-red-600">Rp 27,000,000</div>
               <p className="text-xs text-muted-foreground mt-1">Bulan Maret 2025</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">Rp 18,000,000</div>
               <p className="text-xs text-muted-foreground mt-1">Bulan Maret 2025</p>
            </CardContent>
         </Card>
         </div>

         <Tabs defaultValue="transaksi">
         <TabsList>
            <TabsTrigger value="transaksi">Transaksi</TabsTrigger>
            <TabsTrigger value="laporan">Laporan Bulanan</TabsTrigger>
         </TabsList>
         <TabsContent value="transaksi">
            <Card>
               <CardHeader className="pb-2">
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Daftar Transaksi</CardTitle>
                     <CardDescription>Daftar transaksi keuangan desa</CardDescription>
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
                     <TableHead>Keterangan</TableHead>
                     <TableHead>Tanggal</TableHead>
                     <TableHead>Jenis</TableHead>
                     <TableHead>Jumlah</TableHead>
                     <TableHead className="text-right">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {keuanganData.map((item) => (
                     <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.keterangan}</TableCell>
                        <TableCell>{item.tanggal}</TableCell>
                        <TableCell>
                           <Badge className={getJenisColor(item.jenis)}>{item.jenis}</Badge>
                        </TableCell>
                        <TableCell>{item.jumlah}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm">
                           <FileText className="h-4 w-4" />
                           <span className="sr-only">Detail</span>
                           </Button>
                        </TableCell>
                     </TableRow>
                     ))}
                  </TableBody>
               </Table>
               </CardContent>
            </Card>
         </TabsContent>
         <TabsContent value="laporan">
            <Card>
               <CardHeader>
               <CardTitle>Laporan Bulanan</CardTitle>
               <CardDescription>Laporan keuangan desa per bulan</CardDescription>
               </CardHeader>
               <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                     <TableHead>Bulan</TableHead>
                     <TableHead>Pemasukan</TableHead>
                     <TableHead>Pengeluaran</TableHead>
                     <TableHead>Saldo</TableHead>
                     <TableHead className="text-right">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     <TableRow>
                     <TableCell>Maret 2025</TableCell>
                     <TableCell>Rp 45,000,000</TableCell>
                     <TableCell>Rp 27,000,000</TableCell>
                     <TableCell>Rp 18,000,000</TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                           <Download className="h-4 w-4" />
                           <span className="sr-only">Unduh</span>
                        </Button>
                     </TableCell>
                     </TableRow>
                     <TableRow>
                     <TableCell>Februari 2025</TableCell>
                     <TableCell>Rp 40,000,000</TableCell>
                     <TableCell>Rp 25,000,000</TableCell>
                     <TableCell>Rp 15,000,000</TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                           <Download className="h-4 w-4" />
                           <span className="sr-only">Unduh</span>
                        </Button>
                     </TableCell>
                     </TableRow>
                     <TableRow>
                     <TableCell>Januari 2025</TableCell>
                     <TableCell>Rp 38,000,000</TableCell>
                     <TableCell>Rp 22,000,000</TableCell>
                     <TableCell>Rp 16,000,000</TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                           <Download className="h-4 w-4" />
                           <span className="sr-only">Unduh</span>
                        </Button>
                     </TableCell>
                     </TableRow>
                  </TableBody>
               </Table>
               </CardContent>
            </Card>
         </TabsContent>
         </Tabs>
      </div>
   )
}

