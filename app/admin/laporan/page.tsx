'use client';
import { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, Wallet, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
                    <p className="text-gray-500 text-sm">Analisis keuangan berdasarkan periode.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition text-sm">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1"><Filter size={16} /> Filter:</span>
                    <button onClick={() => setFilter('7days')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${filterLabel === '7 Hari Terakhir' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>7 Hari</button>
                    <button onClick={() => setFilter('thisMonth')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${filterLabel === 'Bulan Ini' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>Bulan Ini</button>
                    <button onClick={() => setFilter('lastMonth')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${filterLabel === 'Bulan Lalu' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>Bulan Lalu</button>
                    <button onClick={() => setFilter('thisYear')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${filterLabel === 'Tahun Ini' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>Tahun Ini</button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setFilterLabel('Custom'); }} className="border rounded px-2 py-1 text-gray-600 outline-none focus:border-blue-500" />
                    <span className="text-gray-400">-</span>
                    <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setFilterLabel('Custom'); }} className="border rounded px-2 py-1 text-gray-600 outline-none focus:border-blue-500" />
                </div>
            </div>

            {/* TOTAL CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Pendapatan ({filterLabel})</p>
                    <p className="font-bold text-gray-800 text-xl">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Pengeluaran ({filterLabel})</p>
                    <p className="font-bold text-gray-800 text-xl">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Laba Bersih ({filterLabel})</p>
                    <p className={`font-bold text-xl ${totalLaba >= 0 ? 'text-blue-600' : 'text-red-600'}`}>Rp {totalLaba.toLocaleString('id-ID')}</p>
                </div>
            </div>

            {/* CHART */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[400px] relative">
                {loading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center text-sm text-blue-600">Memuat data...</div>}

                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                            <Legend />
                            <Bar dataKey="pendapatan" fill="#2563eb" name="Pendapatan" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">Tidak ada data untuk periode ini</div>
                )}
            </div>
        </div>
    );
}