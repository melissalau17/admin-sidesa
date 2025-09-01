import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import type { ReactNode } from "react";
import { SocketProvider } from "@/lib/socket/socket-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Desa - Sistem Administrasi Desa Digital",
  description:
    "Sistem administrasi desa digital untuk pengelolaan yang lebih efisien dan transparan",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <SocketProvider>
            {children}
            <Toaster />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
