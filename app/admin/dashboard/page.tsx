'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

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

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat data dashboard...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg mt-1 w-fit">
                        <Calendar size={16} />
                        <span className="text-sm font-semibold">Periode: {currentMonthName}</span>
                    </div>
                </div>
                <Link href="/admin/keuangan" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    Lihat Detail <ArrowRight size={14} />
                </Link>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pendapatan */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pendapatan Bulan Ini</p>
                        <h3 className="text-2xl font-bold text-gray-900">Rp {stats.totalPendapatan.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                {/* Pengeluaran */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pengeluaran Bulan Ini</p>
                        <h3 className="text-2xl font-bold text-gray-900">Rp {stats.totalPengeluaran.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                {/* Laba Bersih */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Laba Bersih Bulan Ini</p>
                        <h3 className={`text-2xl font-bold ${stats.labaBersih >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            Rp {stats.labaBersih.toLocaleString('id-ID')}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Tabel Transaksi Terbaru (Bulan Ini) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">Transaksi Terbaru (Bulan Ini)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-3 font-medium">Tanggal</th>
                                <th className="px-6 py-3 font-medium">Tipe</th>
                                <th className="px-6 py-3 font-medium">Keterangan</th>
                                <th className="px-6 py-3 font-medium text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {stats.history.length === 0 ? (
                                <tr><td colSpan={4} className="p-6 text-center text-gray-500">Belum ada transaksi bulan ini.</td></tr>
                            ) : (
                                stats.history.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-3 text-gray-600">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'PENDAPATAN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-800">{item.keterangan}</td>
                                        <td className={`px-6 py-3 text-right font-bold ${item.type === 'PENDAPATAN' ? 'text-green-600' : 'text-red-600'
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
        </div>
    );
}