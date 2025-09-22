"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/auth-provider";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { toast } = useToast();
    const { login } = useAuth();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (!username || !password) {
            toast({
                title: "Error",
                description: "Username dan password harus diisi",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log("HTTP Status:", response.status, response.statusText);

            const data = await response.json().catch(err => {
                console.error("JSON parse error:", err);
                throw err;
            });

            console.log("Response body parsed:", data);

            if (!response.ok) {
                throw new Error(data.message || "Login gagal");
            }

            const token = data.token;
            localStorage.setItem("token", token);

            await login(token);
            
            toast({
                title: "Login berhasil",
                description: "Selamat datang di panel administrasi desa",
            });
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Login gagal",
                description: "Username atau password salah",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md border p-2   border-gray-200 shadow-sm">
                <CardHeader className="space-y-1 pb-4 md:pb-6">
                    <CardTitle className="text-xl md:text-2xl font-bold text-center text-[#004D40]">
                        Admin Desa
                    </CardTitle>
                    <CardDescription className="text-center text-sm md:text-base">
                        Masuk ke panel administrasi desa
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5 mt-2">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                placeholder="Masukkan username"
                                value={username}
                                className="w-full p-3 border text-sm md:text-base border-gray-200 rounded-md focus:ring-2 focus:ring-[#004D40] focus:border-[#004D40] focus:outline-none"
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                className="w-full p-3 border text-sm md:text-base border-gray-200 rounded-md focus:ring-2 focus:ring-[#004D40] focus:border-[#004D40] focus:outline-none"
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full text-sm md:text-base bg-[#004D40] hover:bg-[#00695C] text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Memproses..." : "Masuk"}
                        </Button>
                    </form>
                </CardContent>
                <p className="text-xs md:text-sm text-muted-foreground text-gray-500 p-5">
                    Gunakan username: <span className="font-semibold">admin</span>,
                    password: <span className="font-semibold">123321</span>
                </p>
            </Card>
        </div>
    );
}
