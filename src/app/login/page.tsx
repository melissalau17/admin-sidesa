"use client";

import { useState } from "react";
import { Button } from "../../components/ui/buttom";
import { Input } from "../../components/ui/input";


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
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
         <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
         <h2 className="text-2xl font-bold text-center text-[#004D40]">Admin Desa</h2>
         <p className="text-center text-gray-600">Masuk ke panel administrasi desa</p>
         <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
            <Input
               id="username"
               label="Username"
               placeholder=" "
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               disabled={isLoading}
            />
            </div>
            <div className="space-y-2">
            <Input
               id="password"
               type="password"
               label="Password"
               placeholder=" "
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               disabled={isLoading}
               />
            </div>
            <Button
               type="submit"
               className="w-full bg-[#004D40] hover:bg-[#00695C] text-white py-2 rounded-md"
               disabled={isLoading}
            >
               {isLoading ? "Memproses..." : "Masuk"}
            </Button>
         </form>
         <p className="text-center text-sm text-gray-500 mt-4">
            Gunakan username: admin, password: admin
         </p>
         </div>
      </div>
   );
}
