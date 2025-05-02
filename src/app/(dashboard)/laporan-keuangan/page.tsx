"use client"

import { useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/buttom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TambahTransaksiModal } from "@/components/modals/tambah-transaksi-modal"
import { useToast } from "@/hooks/use-toast"
import { SearchComponent } from "@/components/ui/SearchComponent"
import { LihatTransaksiModal } from "@/components/modals/lihat-transaksi-modal"

interface KeuanganItem {
   id: number
   keterangan: string
   tanggal: string
   jenis: string
   jumlah: string
   kategori?: string
   catatan?: string
}

const initialKeuanganData: KeuanganItem[] = [
   {
      id: 1,
      keterangan: "Dana Desa",
      tanggal: "1 Mar 2025",
      jenis: "Pemasukan",
      jumlah: "Rp 25,000,000",
      kategori: "Dana Desa",
      catatan: "Penerimaan dana desa tahap pertama tahun anggaran 2025.",
   },
   {
      id: 2,
      keterangan: "Pembangunan Jembatan",
      tanggal: "5 Mar 2025",
      jenis: "Pengeluaran",
      jumlah: "Rp 15,000,000",
      kategori: "Infrastruktur",
      catatan: "Pembayaran tahap awal untuk pembangunan jembatan penghubung Dusun Sukamaju dan Dusun Harapan Jaya.",
   },
   {
      id: 3,
      keterangan: "Retribusi Pasar",
      tanggal: "8 Mar 2025",
      jenis: "Pemasukan",
      jumlah: "Rp 5,000,000",
      kategori: "Retribusi",
      catatan: "Penerimaan retribusi pasar desa bulan Maret 2025.",
   },
   {
      id: 4,
      keterangan: "Gaji Perangkat Desa",
      tanggal: "10 Mar 2025",
      jenis: "Pengeluaran",
      jumlah: "Rp 12,000,000",
      kategori: "Gaji",
      catatan: "Pembayaran gaji perangkat desa bulan Maret 2025.",
   },
   {
      id: 5,
      keterangan: "Bantuan Provinsi",
      tanggal: "12 Mar 2025",
      jenis: "Pemasukan",
      jumlah: "Rp 15,000,000",
      kategori: "Bantuan",
      catatan: "Penerimaan bantuan dari pemerintah provinsi untuk program pemberdayaan masyarakat desa.",
   },
]

interface LaporanBulananItem {
   bulan: string
   pemasukan: string
   pengeluaran: string
   saldo: string
}

const laporanBulananData: LaporanBulananItem[] = [
   {
      bulan: "Maret 2025",
      pemasukan: "Rp 45,000,000",
      pengeluaran: "Rp 27,000,000",
      saldo: "Rp 18,000,000",
   },
   {
      bulan: "Februari 2025",
      pemasukan: "Rp 40,000,000",
      pengeluaran: "Rp 25,000,000",
      saldo: "Rp 15,000,000",
   },
   {
      bulan: "Januari 2025",
      pemasukan: "Rp 38,000,000",
      pengeluaran: "Rp 22,000,000",
      saldo: "Rp 16,000,000",
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
   const [keuanganData] = useState<KeuanganItem[]>(initialKeuanganData)
   const [searchTransaksiQuery, setSearchTransaksiQuery] = useState<string>("")
   const [searchLaporanQuery, setSearchLaporanQuery] = useState<string>("")
   const [activeTab, setActiveTab] = useState<string>("transaksi")
   const [isDownloading, setIsDownloading] = useState<boolean>(false)
   const { toast } = useToast()

   // Function to handle search input changes for transaksi
   const handleSearchTransaksiChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTransaksiQuery(e.target.value)
   }

   // Function to handle search input changes for laporan
   const handleSearchLaporanChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchLaporanQuery(e.target.value)
   }

   // Function to handle tab change
   const handleTabChange = (value: string) => {
      setActiveTab(value)
   }

   // Function to download report as CSV
   const handleDownloadReport = () => {
      setIsDownloading(true)

      try {
         let csvContent = ""
         let filename = ""

         if (activeTab === "transaksi") {
         // Create CSV for transactions
         csvContent = "No,Keterangan,Tanggal,Jenis,Jumlah\n"

         // Add filtered data to CSV
         filteredTransaksiData.forEach((item) => {
            csvContent += `${item.id},"${item.keterangan}","${item.tanggal}","${item.jenis}","${item.jumlah}"\n`
         })

         filename = "transaksi_keuangan_desa.csv"
         } else {
         // Create CSV for monthly reports
         csvContent = "Bulan,Pemasukan,Pengeluaran,Saldo\n"

         // Add filtered data to CSV
         filteredLaporanData.forEach((item) => {
            csvContent += `"${item.bulan}","${item.pemasukan}","${item.pengeluaran}","${item.saldo}"\n`
         })

         filename = "laporan_bulanan_desa.csv"
         }

         // Create a blob and download link
         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
         const url = URL.createObjectURL(blob)
         const link = document.createElement("a")
         link.setAttribute("href", url)
         link.setAttribute("download", filename)
         link.style.visibility = "hidden"
         document.body.appendChild(link)
         link.click()
         document.body.removeChild(link)

         toast({
         title: "Berhasil",
         description: `Laporan berhasil diunduh sebagai ${filename}`,
         })
      } catch (error) {
         console.error("Error downloading report:", error)
         toast({
         title: "Error",
         description: "Terjadi kesalahan saat mengunduh laporan",
         variant: "destructive",
         })
      } finally {
         setIsDownloading(false)
      }
   }

   // Function to download a specific monthly report
   const handleDownloadMonthlyReport = (month: string) => {
      try {
         // Find the report data for the specified month
         const reportData = laporanBulananData.find((item) => item.bulan === month)

         if (!reportData) {
         throw new Error("Report data not found")
         }

         // Create CSV content
         let csvContent = "Bulan,Pemasukan,Pengeluaran,Saldo\n"
         csvContent += `"${reportData.bulan}","${reportData.pemasukan}","${reportData.pengeluaran}","${reportData.saldo}"\n\n`

         // Add detailed transactions for this month (simplified for demo)
         csvContent += "Detail Transaksi:\n"
         csvContent += "No,Keterangan,Tanggal,Jenis,Jumlah\n"

         // Filter transactions for this month (simplified logic for demo)
         const monthTransactions = keuanganData.filter(
         (item) => item.tanggal.includes(month.split(" ")[0]), // Simple check if transaction date includes month name
         )

         monthTransactions.forEach((item) => {
         csvContent += `${item.id},"${item.keterangan}","${item.tanggal}","${item.jenis}","${item.jumlah}"\n`
         })

         // Create a blob and download link
         const filename = `laporan_${month.toLowerCase().replace(" ", "_")}.csv`
         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
         const url = URL.createObjectURL(blob)
         const link = document.createElement("a")
         link.setAttribute("href", url)
         link.setAttribute("download", filename)
         link.style.visibility = "hidden"
         document.body.appendChild(link)
         link.click()
         document.body.removeChild(link)

         toast({
         title: "Berhasil",
         description: `Laporan ${month} berhasil diunduh`,
         })
      } catch (error) {
         console.error("Error downloading monthly report:", error)
         toast({
         title: "Error",
         description: "Terjadi kesalahan saat mengunduh laporan",
         variant: "destructive",
         })
      }
   }

   // Filter transaksi data based on search query
   const filteredTransaksiData = keuanganData.filter((item) => {
      const query = searchTransaksiQuery.toLowerCase()
      return (
         item.keterangan.toLowerCase().includes(query) ||
         item.tanggal.toLowerCase().includes(query) ||
         item.jenis.toLowerCase().includes(query) ||
         item.jumlah.toLowerCase().includes(query)
      )
   })

   // Filter laporan data based on search query
   const filteredLaporanData = laporanBulananData.filter((item) => {
      const query = searchLaporanQuery.toLowerCase()
      return (
         item.bulan.toLowerCase().includes(query) ||
         item.pemasukan.toLowerCase().includes(query) ||
         item.pengeluaran.toLowerCase().includes(query) ||
         item.saldo.toLowerCase().includes(query)
      )
   })

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
               <p className="text-muted-foreground">Kelola laporan keuangan desa</p>
            </div>
            <div className="flex gap-2">
               <Button variant="destructive" onClick={handleDownloadReport} disabled={isDownloading}>
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Mengunduh..." : "Unduh Laporan"}
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

         <Tabs defaultValue="transaksi" value={activeTab} onValueChange={handleTabChange}>
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
                              <SearchComponent 
                                 searchQuery={searchTransaksiQuery}
                                 onSearchChange={handleSearchTransaksiChange}
                                 placeholder="Cari keterangan, tanggal, jenis..."
                              />
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
                           {filteredTransaksiData.length > 0 ? (
                              filteredTransaksiData.map((item) => (
                                 <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.keterangan}</TableCell>
                                    <TableCell>{item.tanggal}</TableCell>
                                    <TableCell>
                                       <Badge className={getJenisColor(item.jenis)}>{item.jenis}</Badge>
                                    </TableCell>
                                    <TableCell>{item.jumlah}</TableCell>
                                    <TableCell className="text-right">
                                    <LihatTransaksiModal
                                       id={item.id}
                                       keterangan={item.keterangan}
                                       tanggal={item.tanggal}
                                       jenis={item.jenis}
                                       jumlah={item.jumlah}
                                       kategori={item.kategori}
                                       catatan={item.catatan}
                                    />
                                    </TableCell>
                                 </TableRow>
                              ))
                           ) : (
                              <TableRow>
                                 <TableCell colSpan={6} className="text-center py-4">
                                    Tidak ada data yang sesuai dengan pencarian
                                 </TableCell>
                              </TableRow>
                           )}
                        </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            </TabsContent>
            <TabsContent value="laporan">
               <Card>
                  <CardHeader>
                     <div className="flex items-center justify-between">
                        <div>
                           <CardTitle>Laporan Bulanan</CardTitle>
                           <CardDescription>Laporan keuangan desa per bulan</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="relative">
                              <SearchComponent 
                                 searchQuery={searchLaporanQuery}
                                 onSearchChange={handleSearchLaporanChange}
                                 placeholder="Cari bulan, pemasukan, pengeluaran..."
                              />
                           </div>
                        </div>
                     </div>
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
                           {filteredLaporanData.length > 0 ? (
                              filteredLaporanData.map((item, index) => (
                                 <TableRow key={index}>
                                    <TableCell>{item.bulan}</TableCell>
                                    <TableCell>{item.pemasukan}</TableCell>
                                    <TableCell>{item.pengeluaran}</TableCell>
                                    <TableCell>{item.saldo}</TableCell>
                                    <TableCell className="text-right">
                                       <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => handleDownloadMonthlyReport(item.bulan)}
                                       >
                                          <Download className="h-4 w-4" />
                                          <span className="sr-only">Unduh</span>
                                       </Button>
                                    </TableCell>
                                 </TableRow>
                              ))
                           ) : (
                              <TableRow>
                                 <TableCell colSpan={5} className="text-center py-4">
                                    Tidak ada data yang sesuai dengan pencarian
                                 </TableCell>
                              </TableRow>
                           )}
                        </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </div>
   )
}