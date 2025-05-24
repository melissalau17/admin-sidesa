import { FileText, MessageSquare, Newspaper, DollarSign, Users, BarChart3 } from "lucide-react"
import { FeatureItem } from "./feature-item" 

export function FeaturesSection() {
   return (
      <section className="py-20 bg-gray-50">
         <div className="container mx-auto px-4">
         <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Semua yang Anda Butuhkan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Sistem administrasi desa lengkap dengan berbagai fitur yang memudahkan pengelolaan desa modern.
            </p>
         </div>

         <div className="grid lg:grid-cols-2 gap-12 items-center mb-2">
            <div className="space-y-8">
               <FeatureItem
               icon={<FileText className="w-6 h-6 text-[#004D40]" />}
               title="Pengelolaan Surat Digital"
               description="Kelola permohonan surat dari masyarakat dengan sistem digital yang efisien dan mudah dilacak."
               />
               <FeatureItem
               icon={<MessageSquare className="w-6 h-6 text-[#004D40]" />}
               title="Sistem Laporan Terintegrasi"
               description="Terima dan tindaklanjuti laporan masyarakat dengan sistem pelacakan status real-time."
               />
               <FeatureItem
               icon={<Newspaper className="w-6 h-6 text-[#004D40]" />}
               title="Publikasi Berita Desa"
               description="Publikasikan informasi dan berita desa untuk menjaga transparansi dengan masyarakat."
               />
            </div>
            <div className="relative">
               <div className="space-y-8 order-1 lg:order-2">
               <FeatureItem
                  icon={<DollarSign className="w-6 h-6 text-[#004D40]" />}
                  title="Manajemen Keuangan Transparan"
                  description="Kelola keuangan desa dengan sistem pelaporan yang transparan dan mudah diaudit."
               />
               <FeatureItem
                  icon={<Users className="w-6 h-6 text-[#004D40]" />}
                  title="Manajemen Pengguna Multi-Level"
                  description="Atur akses pengguna dengan berbagai tingkat hak akses sesuai peran dan tanggung jawab."
               />
               <FeatureItem
                  icon={<BarChart3 className="w-6 h-6 text-[#004D40]" />}
                  title="Dashboard Analitik Komprehensif"
                  description="Pantau kinerja desa melalui dashboard analitik yang informatif dan mudah dipahami."
               />
               </div>
            </div>
         </div>
         </div>
      </section>
   )
}