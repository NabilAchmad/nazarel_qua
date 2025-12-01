'use client';
import { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Laporan() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/keuangan').then(r => r.json()).then(res => {
            const agg: Record<string, any> = {};
            res.forEach((t: any) => {
                const date = new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                if (!agg[date]) agg[date] = { name: date, pendapatan: 0, pengeluaran: 0 };
                if (t.type === 'PENDAPATAN') agg[date].pendapatan += t.jumlah;
                else agg[date].pengeluaran += t.jumlah;
            });
            // Mengambil 7 hari terakhir data
            setData(Object.values(agg).reverse().slice(0, 7).reverse());
            setLoading(false);
        });
    }, []);

    // Hitung total untuk ditampilkan di UI
    const totalPendapatan = data.reduce((acc, curr) => acc + curr.pendapatan, 0);
    const totalPengeluaran = data.reduce((acc, curr) => acc + curr.pengeluaran, 0);
    const totalLaba = totalPendapatan - totalPengeluaran;

    const handleExport = () => {
        // 1. Header Kolom
        const headers = ['Tanggal', 'Pendapatan', 'Pengeluaran', 'Laba Harian'];
        
        // 2. Data Baris Harian
        const rows = data.map(d => [
            `"${d.name}"`, // Pakai kutip biar format tanggal aman di Excel
            d.pendapatan, 
            d.pengeluaran, 
            d.pendapatan - d.pengeluaran
        ]);

        // 3. Tambahkan Baris Kosong sebagai pemisah
        rows.push(['', '', '', '']); 
        
        // 4. Tambahkan Baris TOTAL di bawah
        rows.push(['TOTAL PERIODE INI', totalPendapatan, totalPengeluaran, totalLaba]);

        // 5. Buat CSV
        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Laporan_Nazarel_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat laporan...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
                    <p className="text-gray-500 text-sm">Grafik & Rekapitulasi 7 Hari Terakhir</p>
                </div>
                <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition">
                    <Download size={18} /> Ekspor CSV Lengkap
                </button>
            </div>

            {/* KARTU RINGKASAN TOTAL (Visualisasi Langsung) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600"><TrendingUp size={20}/></div>
                    <div>
                        <p className="text-xs text-gray-500">Total Pendapatan</p>
                        <p className="font-bold text-gray-800">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600"><TrendingDown size={20}/></div>
                    <div>
                        <p className="text-xs text-gray-500">Total Pengeluaran</p>
                        <p className="font-bold text-gray-800">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Wallet size={20}/></div>
                    <div>
                        <p className="text-xs text-gray-500">Laba Bersih</p>
                        <p className={`font-bold ${totalLaba >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            Rp {totalLaba.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>

            {/* GRAFIK */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[400px]">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }}
                                tickFormatter={(value) => `Rp ${value / 1000}k`} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                            />
                            <Legend iconType="circle" />
                            <Bar dataKey="pendapatan" fill="#2563eb" name="Pendapatan" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">Belum ada data grafik</div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detail Teks Sederhana */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-2">Tips</h3>
                    <p className="text-sm text-blue-700 leading-relaxed">
                        Data CSV yang diunduh kini mencakup <strong>Total Pendapatan</strong>, <strong>Pengeluaran</strong>, dan <strong>Laba Bersih</strong> pada baris paling bawah tabel untuk memudahkan rekapitulasi Anda.
                    </p>
                </div>
            </div>
        </div>
    );
}