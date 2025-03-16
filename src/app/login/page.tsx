"use client";

import { useState } from "react";
import { Button } from "../../components/ui/buttom";

export default function LoginPage() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      if (!username || !password) {
         alert("Username dan password harus diisi");
         setIsLoading(false);
         return;
      }

      if (username === "admin" && password === "admin") {
         try {
            localStorage.setItem("isAuthenticated", "true");
            alert("Login berhasil! Selamat datang di panel administrasi desa");
            setTimeout(() => {
               window.location.href = "/dashboard";
            }, 100);
         } catch (error) {
            console.error("Redirect error:", error);
            alert("Terjadi kesalahan saat login");
         }
      } else {
         alert("Login gagal! Username atau password salah");
         setIsLoading(false);
      }
   };

   return (
      <div className="flex h-screen w-full items-center justify-center">
         <div className="w-full max-w-md bg-white p-8 border-1 rounded-xl">
            <h2 className="text-3xl font-bold text-center text-[#004D40]">Admin Desa</h2>
            <p className="text-center text-gray-600">Masuk ke panel administrasi desa</p>
            
            <form onSubmit={handleLogin} className="space-y-5 mt-5">
               <div>
                  <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
                  <input
                     id="username"
                     placeholder="Masukkan username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     disabled={isLoading}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                  />
               </div>
               <div>
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                  <input
                     id="password"
                     type="password"
                     placeholder="Masukkan password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     disabled={isLoading}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                  />
               </div>
               <Button
                  type="submit"
                  className="w-full bg-[#004D40] hover:bg-[#00695C] text-white py-3 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                  disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Masuk"}
               </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
               Gunakan username: <span className="font-semibold">admin</span>, password: <span className="font-semibold">admin</span>
            </p>
         </div>
      </div>
   );
}
