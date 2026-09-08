'use client';
import { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, Wallet, Calendar, Filter, FileSpreadsheet, CheckCircle2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function Laporan() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // State Filter Tanggal (Default: Bulan Ini)
    const now = new Date();
    const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]);
    const [filterLabel, setFilterLabel] = useState('Bulan Ini');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/keuangan?start=${startDate}&end=${endDate}`);
            const json = await res.json();

            const agg: Record<string, any> = {};
            json.forEach((t: any) => {
                const date = new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                if (!agg[date]) agg[date] = { name: date, pendapatan: 0, pengeluaran: 0 };
                if (t.type === 'PENDAPATAN') agg[date].pendapatan += t.jumlah;
                else agg[date].pengeluaran += t.jumlah;
            });
            setData(Object.values(agg).reverse());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const setFilter = (type: '7days' | 'thisMonth' | 'lastMonth' | 'thisYear') => {
        const d = new Date();
        let start, end, label;

        if (type === '7days') {
            const past = new Date(d);
            past.setDate(d.getDate() - 7);
            start = past;
            end = d;
            label = '7 Hari Terakhir';
        } else if (type === 'thisMonth') {
            start = new Date(d.getFullYear(), d.getMonth(), 1);
            end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            label = 'Bulan Ini';
        } else if (type === 'lastMonth') {
            start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
            end = new Date(d.getFullYear(), d.getMonth(), 0);
            label = 'Bulan Lalu';
        } else if (type === 'thisYear') {
            start = new Date(d.getFullYear(), 0, 1);
            end = new Date(d.getFullYear(), 11, 31);
            label = 'Tahun Ini';
        }

        if (start && end) {
            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(end.toISOString().split('T')[0]);
            setFilterLabel(label || 'Custom');
        }
    };

    const totalPendapatan = data.reduce((acc, curr) => acc + curr.pendapatan, 0);
    const totalPengeluaran = data.reduce((acc, curr) => acc + curr.pengeluaran, 0);
    const totalLaba = totalPendapatan - totalPengeluaran;

    const handleExport = () => {
        const headers = ['Tanggal', 'Pendapatan', 'Pengeluaran', 'Laba Harian'];
        const rows = data.map(d => [`"${d.name}"`, d.pendapatan, d.pengeluaran, d.pendapatan - d.pengeluaran]);
        rows.push(['', '', '', '']);
        rows.push([`TOTAL (${filterLabel})`, totalPendapatan, totalPengeluaran, totalLaba]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Laporan_${filterLabel.replace(' ', '_')}_${startDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Laporan Keuangan</h1>
                    <p className="text-slate-500 text-sm mt-1">Analisis dan visualisasi arus kas berdasarkan periode.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="bg-ocean-600 hover:bg-ocean-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-ocean-600/20 transition-all active:scale-95">
                        <FileSpreadsheet size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-1.5"><Filter size={16} className="text-ocean-500" /> Filter:</span>
                    <button onClick={() => setFilter('7days')} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${filterLabel === '7 Hari Terakhir' ? 'bg-ocean-50 text-ocean-700 border-ocean-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-ocean-600'}`}>7 Hari Terakhir</button>
                    <button onClick={() => setFilter('thisMonth')} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${filterLabel === 'Bulan Ini' ? 'bg-ocean-50 text-ocean-700 border-ocean-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-ocean-600'}`}>Bulan Ini</button>
                    <button onClick={() => setFilter('lastMonth')} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${filterLabel === 'Bulan Lalu' ? 'bg-ocean-50 text-ocean-700 border-ocean-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-ocean-600'}`}>Bulan Lalu</button>
                    <button onClick={() => setFilter('thisYear')} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${filterLabel === 'Tahun Ini' ? 'bg-ocean-50 text-ocean-700 border-ocean-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-ocean-600'}`}>Tahun Ini</button>
                </div>

                <div className="flex items-center gap-2 text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
                    <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setFilterLabel('Custom'); }} className="bg-transparent outline-none text-slate-600 cursor-pointer font-medium" />
                    <span className="text-slate-400 font-bold">-</span>
                    <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setFilterLabel('Custom'); }} className="bg-transparent outline-none text-slate-600 cursor-pointer font-medium" />
                </div>
            </div>

            {/* TOTAL CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition group">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Pendapatan ({filterLabel})</p>
                        <h3 className="text-3xl font-extrabold text-emerald-600">Rp {totalPendapatan.toLocaleString('id-ID')}</h3>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-inner group-hover:scale-110 transition-transform">
                        <ArrowUpCircle size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition group">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Pengeluaran ({filterLabel})</p>
                        <h3 className="text-3xl font-extrabold text-rose-600">Rp {totalPengeluaran.toLocaleString('id-ID')}</h3>
                    </div>
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 shadow-inner group-hover:scale-110 transition-transform">
                        <ArrowDownCircle size={28} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-ocean-900 to-ocean-800 p-6 rounded-2xl shadow-lg border border-ocean-700 flex items-center justify-between hover:-translate-y-1 transition duration-300">
                    <div>
                        <p className="text-sm font-bold text-ocean-200 mb-1">Laba Bersih ({filterLabel})</p>
                        <h3 className={`text-3xl font-extrabold ${totalLaba >= 0 ? 'text-white' : 'text-rose-400'}`}>
                            Rp {totalLaba.toLocaleString('id-ID')}
                        </h3>
                    </div>
                    <div className="p-4 bg-gold-500 text-ocean-900 rounded-2xl shadow-inner shadow-gold-600/50">
                        <CheckCircle2 size={28} />
                    </div>
                </div>
            </div>

            {/* CHART */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[450px] relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ocean-600"></div>
                    </div>
                )}

                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip 
                                cursor={{ fill: '#f8fafc' }} 
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} 
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="pendapatan" fill="#10b981" name="Pendapatan (Rp)" radius={[4, 4, 0, 0]} barSize={30} />
                            <Bar dataKey="pengeluaran" fill="#f43f5e" name="Pengeluaran (Rp)" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 font-medium">
                        Tidak ada data grafik untuk periode ini
                    </div>
                )}
            </div>
        </motion.div>
    );
}