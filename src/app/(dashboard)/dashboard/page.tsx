"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/use-dashboard";
import { StatCard } from "@/components/stat-card";
import { SummaryCard } from "@/components/summary-card";
import { FileText, MessageSquare, Newspaper } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null | undefined>(undefined);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const t = localStorage.getItem("token");
            setToken(t ?? null);
        }
    }, []);

    useEffect(() => {
        if (token === null) router.push("/login");
    }, [token, router]);

    const { stats, loading } = useDashboard(token ?? null);

    if (token === undefined || loading) return <p>Loading...</p>;
    if (!stats) return <p>Gagal memuat data dashboard.</p>;

    const getIcon = (type: string) => {
        switch (type) {
            case "permohonan": return <FileText className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />;
            case "laporan": return <MessageSquare className="h-3 w-3 md:h-4 md:w-4 text-green-600" />;
            case "berita": return <Newspaper className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />;
            default: return null;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case "permohonan": return "bg-blue-100";
            case "laporan": return "bg-green-100";
            case "berita": return "bg-purple-100";
            default: return "bg-gray-100";
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div>
                <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                    Selamat Datang di panel administrasi desa Hamparan Perak
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <StatCard
                    title="Permohonan Surat"
                    value={stats.permohonans.toString()}
                    description={`${stats.newPermohonans} permohonan baru`}
                />
                <StatCard
                    title="Laporan Masyarakat"
                    value={stats.laporans.toString()}
                    description={`${stats.newLaporans} belum direspon`}
                />
            </div>

            <div className="grid gap-3 md:grid-cols-3 md:gap-4">
                <SummaryCard title="Aktivitas Terbaru" subtitle="Aktivitas terbaru di desa">
                    <div className="space-y-3 md:space-y-4">
                        {stats.activities.length > 0 ? (
                            stats.activities.map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-3 md:gap-4">
                                    <div className={`rounded-full p-1.5 md:p-2 ${getBgColor(activity.type)}`}>
                                        {getIcon(activity.type)}
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm font-medium">{activity.title}</p>
                                        <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-muted-foreground">Belum ada aktivitas</p>
                        )}
                    </div>
                </SummaryCard>

                <SummaryCard title="Berita Desa" subtitle="Informasi terkini">
                    <div className="space-y-2">
                        <p className="text-lg md:text-2xl font-bold">{stats.beritas.total}</p>
                        <p className="text-sm text-muted-foreground">{stats.beritas.newThisWeek} dipublikasikan minggu ini</p>
                    </div>
                </SummaryCard>

                <SummaryCard title="Penduduk" subtitle="Statistik jumlah penduduk">
                    <div className="space-y-2">
                        <p className="text-lg md:text-2xl font-bold">{stats.users.total}</p>
                        <p className="text-sm text-muted-foreground">+{stats.users.newThisMonth} bulan ini</p>
                    </div>
                </SummaryCard>
            </div>
        </div>
    );
}
