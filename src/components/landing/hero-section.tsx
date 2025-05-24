import Link from "next/link";
import { Button } from "@/components/ui/buttom";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function HeroSection() {
   return (
      <section className="relative py-10 lg:py-14 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50"></div>
            <div className="container mx-auto px-4 relative"> 
            <div className="grid lg:grid-cols-[3fr_2fr] gap-12 items-center">
               <div className="space-y-8 px-3">
                  <div className="space-y-4">
                  <Badge variant="outline" className="text-[#004D40] border-[#004D40]">
                     Sistem Administrasi Digital
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                     Pengelolaan Desa
                     <br />
                     Berbasis Digital Secara <span className="text-[#004D40]">Akurat</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                     Sistem administrasi desa digital yang memungkinkan pengelolaan surat, laporan masyarakat, berita desa,
                     dan keuangan dalam satu platform terintegrasi.
                  </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="border-2 text-[#004D40] hover:bg-gray-50 px-8 py-3">
                     Hubungi Kami
                  </Button>
                  <Link href="/login" passHref>
                     <Button size="lg" className="bg-[#004D40] w-full hover:bg-[#00695C] text-white px-8 py-3">
                        Login
                     </Button>
                  </Link>
                  </div>
               </div>

               <div className="flex justify-center items-center">
                  <Image
                  src="/mob.png"
                  alt="Admin Desa Mobile App"
                  width={448}
                  height={500} 
                  className="w-full h-auto max-w-sm lg:max-w-md object-contain"
                  priority 
                  />
               </div>
            </div>
         </div>
      </section>
   );
}