'use client';
import { useState, useEffect } from 'react';
import {
    Plus, Trash2, Filter, X, Calendar, Search,
    ArrowDownCircle, ArrowUpCircle, ArrowUp, ArrowDown, Download, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Keuangan() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Filter & Sorting
    const [filterType, setFilterType] = useState('ALL'); // ALL, PENDAPATAN, PENGELUARAN
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'desc' = Terbaru dulu

    // State Tanggal (Default: Bulan Ini)
    const now = new Date();
    const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]);
    const [activePeriod, setActivePeriod] = useState('Bulan Ini');

    // State Form
    const [formData, setFormData] = useState({
        type: 'PENDAPATAN',
        tanggal: new Date().toISOString().split('T')[0],
        jumlah: 0,
        keterangan: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    // Fetch Data
    const fetchTrans = async () => {
        setIsLoading(true);
        let url = '/api/keuangan';
        if (startDate && endDate) {
            url += `?start=${startDate}&end=${endDate}`;
        }
        try {
            const res = await fetch(url);
            const data = await res.json();
            setTransactions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrans();
    }, [startDate, endDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await fetch('/api/keuangan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            setFormData({ ...formData, jumlah: 0, keterangan: '' });
            fetchTrans();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number, type: string) => {
        if (!confirm("Hapus transaksi ini?")) return;
        await fetch(`/api/keuangan/${id}?type=${type}`, { method: 'DELETE' });
        fetchTrans();
    };

    // --- LOGIKA UTAMA: FILTER + SORTING ---
    const processedTransactions = transactions
        .filter(t => filterType === 'ALL' || t.type === filterType)
        .sort((a, b) => {
            const dateA = new Date(a.tanggal).getTime();
            const dateB = new Date(b.tanggal).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    // Hitung Total (Berdasarkan hasil filter)
    const totalMasuk = processedTransactions.filter(t => t.type === 'PENDAPATAN').reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalKeluar = processedTransactions.filter(t => t.type === 'PENGELUARAN').reduce((acc, curr) => acc + curr.jumlah, 0);
    const selisih = totalMasuk - totalKeluar;

    const toggleSort = () => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');

    const setQuickFilter = (type: 'today' | 'thisWeek' | 'thisMonth' | 'all') => {
        const d = new Date();
        if (type === 'today') {
            const today = d.toISOString().split('T')[0];
            setStartDate(today); setEndDate(today); setActivePeriod('Hari Ini');
        } else if (type === 'thisWeek') {
            const first = d.getDate() - d.getDay();
            const last = first + 6;
            const firstDay = new Date(d.setDate(first)).toISOString().split('T')[0];
            const lastDay = new Date(d.setDate(last)).toISOString().split('T')[0];
            setStartDate(firstDay); setEndDate(lastDay); setActivePeriod('Minggu Ini');
        } else if (type === 'thisMonth') {
            const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
            setStartDate(start); setEndDate(end); setActivePeriod('Bulan Ini');
        } else if (type === 'all') {
            setStartDate('2024-01-01');
            setEndDate(new Date(d.getFullYear() + 1, 11, 31).toISOString().split('T')[0]);
            setActivePeriod('Semua Data');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Keuangan</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola pencatatan arus kas masuk dan keluar secara rinci.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-ocean-600 hover:bg-ocean-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-ocean-600/20 transition-all active:scale-95"
                >
                    <Plus size={18} /> Transaksi Baru
                </button>
            </div>

            {/* FILTER BAR SECTION */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col xl:flex-row gap-5 justify-between items-start xl:items-center">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-1.5"><Calendar size={16} className="text-ocean-500"/> Periode:</span>
                    <button onClick={() => setQuickFilter('today')} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${activePeriod === 'Hari Ini' ? 'bg-ocean-50 text-ocean-700 border-ocean-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-ocean-600'}`}>Hari Ini</button>
                    <button onClick={() => setQuickFilter('thisWeek')} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${activePeriod === 'Minggu Ini' ? 'bg-ocean-50 text-ocean-700 border-ocean-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-ocean-600'}`}>Minggu Ini</button>
                    <button onClick={() => setQuickFilter('thisMonth')} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${activePeriod === 'Bulan Ini' ? 'bg-ocean-50 text-ocean-700 border-ocean-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-ocean-600'}`}>Bulan Ini</button>
                    <button onClick={() => setQuickFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${activePeriod === 'Semua Data' ? 'bg-ocean-50 text-ocean-700 border-ocean-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-ocean-600'}`}>Semua</button>
                </div>

                <div className="flex items-center gap-2 text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
                    <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setActivePeriod('Custom'); }} className="bg-transparent outline-none text-slate-600 cursor-pointer font-medium" />
                    <span className="text-slate-400 font-bold">-</span>
                    <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setActivePeriod('Custom'); }} className="bg-transparent outline-none text-slate-600 cursor-pointer font-medium" />
                </div>

                <div className="flex items-center gap-2 w-full xl:w-auto relative">
                    <Filter size={16} className="text-ocean-500 absolute left-3" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:bg-white text-slate-700 w-full xl:w-auto appearance-none transition cursor-pointer"
                    >
                        <option value="ALL">Semua Transaksi</option>
                        <option value="PENDAPATAN">Hanya Pemasukan</option>
                        <option value="PENGELUARAN">Hanya Pengeluaran</option>
                    </select>
                </div>
            </div>

            {/* RINGKASAN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition group">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Total Pemasukan</p>
                        <h3 className="text-3xl font-extrabold text-emerald-600">Rp {totalMasuk.toLocaleString('id-ID')}</h3>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-inner group-hover:scale-110 transition-transform">
                        <ArrowUpCircle size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition group">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Total Pengeluaran</p>
                        <h3 className="text-3xl font-extrabold text-rose-600">Rp {totalKeluar.toLocaleString('id-ID')}</h3>
                    </div>
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 shadow-inner group-hover:scale-110 transition-transform">
                        <ArrowDownCircle size={28} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-ocean-900 to-ocean-800 p-6 rounded-2xl shadow-lg border border-ocean-700 flex items-center justify-between hover:-translate-y-1 transition duration-300">
                    <div>
                        <p className="text-sm font-bold text-ocean-200 mb-1">Sisa Kas (NET)</p>
                        <h3 className={`text-3xl font-extrabold ${selisih >= 0 ? 'text-white' : 'text-rose-400'}`}>
                            Rp {selisih.toLocaleString('id-ID')}
                        </h3>
                    </div>
                    <div className="p-4 bg-gold-500 text-ocean-900 rounded-2xl shadow-inner shadow-gold-600/50">
                        <CheckCircle2 size={28} />
                    </div>
                </div>
            </div>

            {/* TABEL DATA */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ocean-600"></div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
                            <tr>
                                <th
                                    className="p-5 cursor-pointer hover:bg-slate-100 transition select-none group"
                                    onClick={toggleSort}
                                >
                                    <div className="flex items-center gap-1.5">
                                        Tanggal
                                        <div className="bg-white p-1 rounded border border-slate-200 shadow-sm">
                                            {sortOrder === 'asc' ? <ArrowUp size={12} className="text-ocean-600" /> : <ArrowDown size={12} className="text-ocean-600" />}
                                        </div>
                                    </div>
                                </th>
                                <th className="p-5">Tipe</th>
                                <th className="p-5">Keterangan</th>
                                <th className="p-5 text-right">Jumlah</th>
                                <th className="p-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {processedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                                                <Search size={32} />
                                            </div>
                                            <p className="font-medium">Tidak ada transaksi pada periode ini.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                processedTransactions.map((t, idx) => (
                                    <tr key={`${t.type}-${t.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-5 text-slate-600 font-semibold whitespace-nowrap">
                                            {new Date(t.tanggal).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${t.type === 'PENDAPATAN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {t.type === 'PENDAPATAN' ? 'MASUK' : 'KELUAR'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-slate-800 font-medium">{t.keterangan}</td>
                                        <td className={`p-5 text-right font-extrabold whitespace-nowrap ${t.type === 'PENDAPATAN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.type === 'PENDAPATAN' ? '+' : '-'} Rp {t.jumlah.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleDelete(t.id, t.type)} className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Hapus">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL TAMBAH */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-ocean-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative border border-slate-100"
                    >
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full"><X size={20} /></button>
                        <h2 className="text-2xl font-extrabold mb-6 text-slate-800">Catat Transaksi</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Transaksi</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setFormData({ ...formData, type: 'PENDAPATAN' })}
                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${formData.type === 'PENDAPATAN' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        Pemasukan (Masuk)
                                    </button>
                                    <button type="button" onClick={() => setFormData({ ...formData, type: 'PENGELUARAN' })}
                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${formData.type === 'PENGELUARAN' ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        Pengeluaran (Keluar)
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal</label>
                                <input required type="date" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 outline-none transition bg-slate-50 focus:bg-white"
                                    value={formData.tanggal} onChange={e => setFormData({ ...formData, tanggal: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jumlah Uang (Rp)</label>
                                <input required type="number" min="0" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 outline-none transition bg-slate-50 focus:bg-white"
                                    value={formData.jumlah || ''} onChange={e => setFormData({ ...formData, jumlah: parseFloat(e.target.value) })} placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keterangan</label>
                                <input required placeholder="Contoh: Penjualan Galon / Beli Tisu" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 outline-none transition bg-slate-50 focus:bg-white"
                                    value={formData.keterangan} onChange={e => setFormData({ ...formData, keterangan: e.target.value })} />
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition">Batal</button>
                                <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-ocean-600 text-white font-bold rounded-xl hover:bg-ocean-700 transition-all active:scale-95 shadow-sm shadow-ocean-600/20 disabled:opacity-50">
                                    {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}