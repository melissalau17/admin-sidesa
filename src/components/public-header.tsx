"use client"; 

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react"; 
import Image from 'next/image';

export function PublicHeader() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   return (
      // Header kembali ke gaya yang Anda inginkan (backdrop-blur + gradient transparan)
      // Tidak ada lagi kelas `dark:` di sini karena tidak ada fitur tema.
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-gradient-to-r from-[#f2f7fd]/90 to-white/60">
         <div className="container mx-auto px-5">
         <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
               <Image
               src="/homestay.svg"
               alt="Homestay Logo"
               width={32}
               height={32}
               />
               <span className="font-bold px-2 text-xl text-[#004D40]">Admin Desa</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
               <Link href="/" className="text-gray-700 hover:text-[#004D40] font-medium transition-colors">
               Beranda
               </Link>
               <Link href="#features" className="text-gray-700 hover:text-[#004D40] font-medium transition-colors">
               Fitur
               </Link>
               <Link href="#pricing" className="text-gray-700 hover:text-[#004D40] font-medium transition-colors">
               Harga
               </Link>
               <Link href="#faq" className="text-gray-700 hover:text-[#004D40] font-medium transition-colors">
               FAQ
               </Link>
               <Link href="#contact" className="text-gray-700 hover:text-[#004D40] font-medium transition-colors">
               Kontak
               </Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
               <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
               </Button>
            </div>
         </div>
         </div>

         {/* Mobile Menu */}
         {mobileMenuOpen && (
         // Gaya mobile menu kembali ke default (tidak ada kelas dark:)
         <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 space-y-4">
               <Link
               href="/"
               className="block text-gray-700 hover:text-[#004D40] font-medium py-2"
               onClick={() => setMobileMenuOpen(false)}
               >
               Beranda
               </Link>
               <Link
               href="#features"
               className="block text-gray-700 hover:text-[#004D40] font-medium py-2"
               onClick={() => setMobileMenuOpen(false)}
               >
               Fitur
               </Link>
               <Link
               href="#pricing"
               className="block text-gray-700 hover:text-[#004D40] font-medium py-2"
               onClick={() => setMobileMenuOpen(false)}
               >
               Harga
               </Link>
               <Link
               href="#faq"
               className="block text-gray-700 hover:text-[#004D40] font-medium py-2"
               onClick={() => setMobileMenuOpen(false)}
               >
               FAQ
               </Link>
               <Link
               href="#contact"
               className="block text-gray-700 hover:text-[#004D40] font-medium py-2"
               onClick={() => setMobileMenuOpen(false)}
               >
               Kontak
               </Link>
               <div className="pt-4 border-t border-gray-200">
               <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#004D40] hover:bg-[#00695C] text-white">Masuk</Button>
               </Link>
               </div>
            </div>
         </div>
         )}
      </header>
   );
}