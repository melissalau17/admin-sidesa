import Link from 'next/link'; 
import Image from 'next/image';

export function Footer() {
   return (
      <footer className="bg-gray-900 border-t border-gray-800 text-white py-12">
         <div className="container mx-auto px-4">
         <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
               <div className="flex items-center">
                  <Image
                  src="/homestay.svg"
                  alt="Homestay Logo"
                  width={32}
                  height={32} 
                  />
                  <span className="font-bold text-xl">Admin Desa</span>
               </div>
               <p className="text-gray-400">
               Solusi digital terpadu untuk meningkatkan efisiensi dan transparansi administrasi desa.
               </p>
            </div>

            <div>
               <h3 className="text-lg font-semibold mb-4">Produk</h3>
               <ul className="space-y-2 text-gray-400">
               <li>
                  <Link href="#" className="hover:text-white transition-colors">
                     Fitur
                  </Link>
               </li>
               <li>
                  <Link href="#" className="hover:text-white transition-colors">
                     Harga
                  </Link>
               </li>
               <li>
                  <Link href="#" className="hover:text-white transition-colors">
                     Demo
                  </Link>
               </li>
               </ul>
            </div>

            <div>
               <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
               <ul className="space-y-2 text-gray-400">
               <li>
                  <Link href="#" className="hover:text-white transition-colors">
                     Bantuan
                  </Link>
               </li>
               <li>
                  <Link href="#" className="hover:text-white transition-colors">
                     Dokumentasi
                  </Link>
               </li>
               <li>
                  <Link href="#" className="hover:text-white transition-colors">
                     Kontak
                  </Link>
               </li>
               </ul>
            </div>

            <div>
               <h3 className="text-lg font-semibold mb-4">Kontak</h3>
               <div className="space-y-2 text-gray-400">
               <p>Email: info@admindesa.id</p>
               <p>Telepon: (021) 1234-5678</p>
               <p>WhatsApp: +62 812-3456-7890</p>
               </div>
            </div>
         </div>

         <div className="mt-8 pt-8 text-center text-gray-400 border-t border-gray-800">
            <p>&copy; 2025 Admin Desa. Hak Cipta Dilindungi.</p>
         </div>
         </div>
      </footer>
   );
}