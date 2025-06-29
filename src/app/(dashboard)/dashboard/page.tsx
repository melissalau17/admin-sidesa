"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { StatCard } from "@/components/stat-card";
import { SummaryCard } from "@/components/summary-card";
import { FileText, MessageSquare, Newspaper, Users } from "lucide-react";

export default function DashboardPage() {
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get("http://localhost:19000/api/users");
        const users = res.data;
        setUserCount(users.length);
      } catch (error) {
        console.error("Gagal memuat data user:", error);
        setUserCount(0);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Selamat Datang di panel administrasi desa
        </p>
      </div>

      {/* Stat Cards - 2 kolom besar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <StatCard
          title="Permohonan Surat"
          value="12"
          description="4 permohonan baru"
        />
        <StatCard
          title="Laporan Masyarakat"
          value="8"
          description="3 belum direspon"
        />
      </div>

      {/* Summary Cards - 3 kolom: Aktivitas, Berita, Penduduk */}
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        <SummaryCard
          title="Aktivitas Terbaru"
          subtitle="Aktivitas terbaru di desa"
        >
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="rounded-full bg-blue-100 p-1.5 md:p-2">
                <FileText className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium">
                  Permohonan surat keterangan domisili
                </p>
                <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="rounded-full bg-green-100 p-1.5 md:p-2">
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium">
                  Laporan kerusakan jalan desa
                </p>
                <p className="text-xs text-muted-foreground">5 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="rounded-full bg-purple-100 p-1.5 md:p-2">
                <Newspaper className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium">
                  Berita baru dipublikasikan
                </p>
                <p className="text-xs text-muted-foreground">Kemarin</p>
              </div>
            </div>
          </div>
        </SummaryCard>

        <SummaryCard title="Berita Desa" subtitle="Informasi terkini">
          <div className="space-y-2">
            <p className="text-lg md:text-2xl font-bold">24</p>
            <p className="text-sm text-muted-foreground">
              2 dipublikasikan minggu ini
            </p>
          </div>
        </SummaryCard>

        <SummaryCard title="Penduduk" subtitle="Statistik jumlah penduduk">
          <div className="space-y-2">
            <p className="text-lg md:text-2xl font-bold">{userCount}</p>
            <p className="text-sm text-muted-foreground">
              +{userCount > 0 ? 12 : 0} bulan ini
            </p>
          </div>
        </SummaryCard>
      </div>
    </div>
  );
}
