import { StatCard } from "@/components/stat-card"
import { SummaryCard } from "@/components/summary-card"
import { FileText, MessageSquare, Newspaper } from "lucide-react"

export default function DashboardPage() {
   return (
      <div className="space-y-4 md:space-y-6">
         <div>
            <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Selamat Datang di panel administrasi desa</p>
         </div>

         <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
            <StatCard title="Permohonan Surat" value="12" description="4 permohonan baru" />
            <StatCard title="Laporan Masyarakat" value="8" description="3 belum direspon" />
            <StatCard title="Berita Desa" value="24" description="2 dipublikasikan minggu ini" />
            <StatCard title="Penduduk" value="1,334" description="+12 bulan ini" />
         </div>

         <div className="grid gap-3 md:grid-cols-2 md:gap-4">
         <SummaryCard title="Laporan Keuangan" subtitle="Ringkasan keuangan desa bulan ini">
            <div className="space-y-3 md:space-y-4">
               <div className="grid grid-cols-2 gap-3 md:gap-4">
               <div>
                  <p className="text-xs md:text-sm font-medium">Pendapatan</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">Rp 45,000,000</p>
               </div>
               <div>
                  <p className="text-xs md:text-sm font-medium">Pengeluaran</p>
                  <p className="text-lg md:text-2xl font-bold text-red-600">Rp 32,500,000</p>
               </div>
               </div>
               <div>
               <p className="text-xs md:text-sm font-medium">Saldo</p>
               <p className="text-lg md:text-2xl font-bold">Rp 12,500,000</p>
               </div>
            </div>
         </SummaryCard>

         <SummaryCard title="Aktivitas Terbaru" subtitle="Aktivitas terbaru di desa">
            <div className="space-y-3 md:space-y-4">
               <div className="flex items-center gap-3 md:gap-4">
               <div className="rounded-full bg-blue-100 p-1.5 md:p-2">
                  <FileText className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
               </div>
               <div>
                  <p className="text-xs md:text-sm font-medium">Permohonan surat keterangan domisili</p>
                  <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
               </div>
               </div>
               <div className="flex items-center gap-3 md:gap-4">
               <div className="rounded-full bg-green-100 p-1.5 md:p-2">
                  <MessageSquare className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
               </div>
               <div>
                  <p className="text-xs md:text-sm font-medium">Laporan kerusakan jalan desa</p>
                  <p className="text-xs text-muted-foreground">5 jam yang lalu</p>
               </div>
               </div>
               <div className="flex items-center gap-3 md:gap-4">
               <div className="rounded-full bg-purple-100 p-1.5 md:p-2">
                  <Newspaper className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
               </div>
               <div>
                  <p className="text-xs md:text-sm font-medium">Berita baru dipublikasikan</p>
                  <p className="text-xs text-muted-foreground">Kemarin</p>
               </div>
               </div>
            </div>
         </SummaryCard>
         </div>
      </div>
   )
}

