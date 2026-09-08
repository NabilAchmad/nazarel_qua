'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Format Nama Bulan untuk UI
    const currentMonthName = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    useEffect(() => {
        // HITUNG TANGGAL AWAL DAN AKHIR BULAN INI
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        // Panggil API dengan filter tanggal
        fetch(`/api/keuangan/summary?start=${startOfMonth}&end=${endOfMonth}`)
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
        </div>
    );
    if (!stats) return <div className="p-8 text-center text-rose-500 font-medium">Gagal memuat data.</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                    <div className="flex items-center gap-2 text-ocean-600 bg-ocean-50 px-3 py-1.5 rounded-lg mt-2 w-fit border border-ocean-100">
                        <Calendar size={16} />
                        <span className="text-sm font-semibold">Periode: {currentMonthName}</span>
                    </div>
                </div>
                <Link href="/admin/keuangan" className="text-sm text-ocean-600 font-semibold hover:text-ocean-700 flex items-center gap-1 bg-ocean-50 hover:bg-ocean-100 px-4 py-2 rounded-xl transition">
                    Lihat Detail <ArrowRight size={16} />
                </Link>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pendapatan */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-inner">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Pendapatan Bulan Ini</p>
                        <h3 className="text-2xl font-bold text-slate-900">Rp {stats.totalPendapatan.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                {/* Pengeluaran */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition">
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 shadow-inner">
                        <TrendingDown size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Pengeluaran Bulan Ini</p>
                        <h3 className="text-2xl font-bold text-slate-900">Rp {stats.totalPengeluaran.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                {/* Laba Bersih */}
                <div className="bg-gradient-to-br from-ocean-900 to-ocean-800 p-6 rounded-2xl shadow-lg border border-ocean-700 flex items-center gap-5 transform hover:-translate-y-1 transition duration-300">
                    <div className="p-4 bg-gold-500 text-ocean-900 rounded-2xl shadow-inner shadow-gold-600/50">
                        <Wallet size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-ocean-200 mb-1">Laba Bersih Bulan Ini</p>
                        <h3 className={`text-2xl font-bold ${stats.labaBersih >= 0 ? 'text-white' : 'text-rose-400'}`}>
                            Rp {stats.labaBersih.toLocaleString('id-ID')}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Tabel Transaksi Terbaru (Bulan Ini) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-bold text-slate-800 text-lg">Transaksi Terbaru (Bulan Ini)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Tanggal</th>
                                <th className="px-6 py-4 font-semibold">Tipe</th>
                                <th className="px-6 py-4 font-semibold">Keterangan</th>
                                <th className="px-6 py-4 font-semibold text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {stats.history.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada transaksi bulan ini.</td></tr>
                            ) : (
                                stats.history.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 font-medium">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${item.type === 'PENDAPATAN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-800">{item.keterangan}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${item.type === 'PENDAPATAN' ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                            Rp {item.jumlah.toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}