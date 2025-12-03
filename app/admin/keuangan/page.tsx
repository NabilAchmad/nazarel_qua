'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Filter, X, Calendar, Search, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function Keuangan() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Filter
    const [filterType, setFilterType] = useState('ALL'); // ALL, PENDAPATAN, PENGELUARAN

    // State Tanggal (Default: Bulan Ini)
    const now = new Date();
    const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]);
    const [activePeriod, setActivePeriod] = useState('Bulan Ini');

    // State Form Transaksi Baru
    const [formData, setFormData] = useState({
        type: 'PENDAPATAN',
        tanggal: new Date().toISOString().split('T')[0],
        jumlah: 0,
        keterangan: ''
    });

    // Fetch Data dengan Filter Tanggal
    const fetchTrans = async () => {
        let url = '/api/keuangan';
        // Jika ada tanggal, tambahkan query param
        if (startDate && endDate) {
            url += `?start=${startDate}&end=${endDate}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setTransactions(data);
    };

    // Ambil data setiap kali tanggal berubah
    useEffect(() => {
        fetchTrans();
    }, [startDate, endDate]);

    // Handle Tambah Transaksi
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/keuangan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setIsModalOpen(false);
        setFormData({ ...formData, jumlah: 0, keterangan: '' });
        fetchTrans(); // Refresh data
    };

    // Handle Hapus
    const handleDelete = async (id: number, type: string) => {
        if (!confirm("Hapus transaksi ini?")) return;
        await fetch(`/api/keuangan/${id}?type=${type}`, { method: 'DELETE' });
        fetchTrans();
    };

    // Filter Client-Side (Jenis Transaksi)
    const filtered = transactions.filter(t => filterType === 'ALL' || t.type === filterType);

    // Hitung Total Berdasarkan Data yang Tampil (Filtered Date)
    const totalMasuk = filtered.filter(t => t.type === 'PENDAPATAN').reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalKeluar = filtered.filter(t => t.type === 'PENGELUARAN').reduce((acc, curr) => acc + curr.jumlah, 0);
    const selisih = totalMasuk - totalKeluar;

    // Helper Set Tanggal Cepat
    const setQuickFilter = (type: 'today' | 'thisWeek' | 'thisMonth' | 'all') => {
        const d = new Date();

        if (type === 'today') {
            const today = d.toISOString().split('T')[0];
            setStartDate(today);
            setEndDate(today);
            setActivePeriod('Hari Ini');
        } else if (type === 'thisWeek') {
            const first = d.getDate() - d.getDay();
            const last = first + 6;
            const firstDay = new Date(d.setDate(first)).toISOString().split('T')[0];
            const lastDay = new Date(d.setDate(last)).toISOString().split('T')[0];
            setStartDate(firstDay);
            setEndDate(lastDay);
            setActivePeriod('Minggu Ini');
        } else if (type === 'thisMonth') {
            const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
            setStartDate(start);
            setEndDate(end);
            setActivePeriod('Bulan Ini');
        } else if (type === 'all') {
            // Set range sangat lebar atau kosongkan (tergantung backend). 
            // Disini kita set 5 tahun ke belakang agar aman
            setStartDate('2024-01-01');
            setEndDate(new Date(d.getFullYear() + 1, 11, 31).toISOString().split('T')[0]);
            setActivePeriod('Semua Data');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Data Keuangan</h1>
                    <p className="text-gray-500 text-sm">Kelola pemasukan dan pengeluaran harian.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition">
                    <Plus size={18} /> Transaksi Baru
                </button>
            </div>

            {/* FILTER BAR SECTION */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">

                {/* Kiri: Filter Periode Cepat */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-gray-700 mr-2 flex items-center gap-1"><Calendar size={16} /> Periode:</span>
                    <button onClick={() => setQuickFilter('today')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${activePeriod === 'Hari Ini' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>Hari Ini</button>
                    <button onClick={() => setQuickFilter('thisWeek')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${activePeriod === 'Minggu Ini' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>Minggu Ini</button>
                    <button onClick={() => setQuickFilter('thisMonth')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${activePeriod === 'Bulan Ini' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>Bulan Ini</button>
                    <button onClick={() => setQuickFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${activePeriod === 'Semua Data' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>Semua</button>
                </div>

                {/* Tengah: Date Picker Custom */}
                <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setActivePeriod('Custom'); }} className="bg-transparent outline-none text-gray-600 cursor-pointer" />
                    <span className="text-gray-400">-</span>
                    <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setActivePeriod('Custom'); }} className="bg-transparent outline-none text-gray-600 cursor-pointer" />
                </div>

                {/* Kanan: Filter Tipe */}
                <div className="flex items-center gap-2 w-full xl:w-auto">
                    <Filter size={16} className="text-gray-400" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full xl:w-auto"
                    >
                        <option value="ALL">Semua Tipe</option>
                        <option value="PENDAPATAN">Hanya Pemasukan</option>
                        <option value="PENGELUARAN">Hanya Pengeluaran</option>
                    </select>
                </div>
            </div>

            {/* RINGKASAN KECIL (Berdasarkan Filter) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-green-600 font-semibold mb-1">Total Pemasukan ({activePeriod})</p>
                        <p className="text-xl font-bold text-green-700">Rp {totalMasuk.toLocaleString('id-ID')}</p>
                    </div>
                    <ArrowUpCircle className="text-green-400" size={28} />
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-red-600 font-semibold mb-1">Total Pengeluaran ({activePeriod})</p>
                        <p className="text-xl font-bold text-red-700">Rp {totalKeluar.toLocaleString('id-ID')}</p>
                    </div>
                    <ArrowDownCircle className="text-red-400" size={28} />
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-blue-600 font-semibold mb-1">Sisa Kas ({activePeriod})</p>
                        <p className={`text-xl font-bold ${selisih >= 0 ? 'text-blue-700' : 'text-red-600'}`}>Rp {selisih.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-xs px-2 py-1 bg-white rounded border border-blue-200 text-blue-600 font-bold">NET</div>
                </div>
            </div>

            {/* TABEL */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                            <tr>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Tipe</th>
                                <th className="p-4">Keterangan</th>
                                <th className="p-4 text-right">Jumlah</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                                    <Search size={32} className="text-gray-300" />
                                    Tidak ada transaksi pada periode ini.
                                </td></tr>
                            ) : (
                                filtered.map((t, idx) => (
                                    <tr key={`${t.type}-${t.id}-${idx}`} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-gray-600 whitespace-nowrap">
                                            {new Date(t.tanggal).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long' })}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.type === 'PENDAPATAN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {t.type === 'PENDAPATAN' ? 'MASUK' : 'KELUAR'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-800 font-medium">{t.keterangan}</td>
                                        <td className={`p-4 text-right font-bold whitespace-nowrap ${t.type === 'PENDAPATAN' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'PENDAPATAN' ? '+' : '-'} Rp {t.jumlah.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => handleDelete(t.id, t.type)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition" title="Hapus">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Transaksi */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Catat Transaksi</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Transaksi</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setFormData({ ...formData, type: 'PENDAPATAN' })}
                                        className={`py-2 rounded-lg text-sm font-bold border ${formData.type === 'PENDAPATAN' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                        Pemasukan
                                    </button>
                                    <button type="button" onClick={() => setFormData({ ...formData, type: 'PENGELUARAN' })}
                                        className={`py-2 rounded-lg text-sm font-bold border ${formData.type === 'PENGELUARAN' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                        Pengeluaran
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                <input required type="date" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.tanggal} onChange={e => setFormData({ ...formData, tanggal: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
                                <input required type="number" min="0" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.jumlah || ''} onChange={e => setFormData({ ...formData, jumlah: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                                <input required placeholder="Contoh: Penjualan Galon / Beli Tisu" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.keterangan} onChange={e => setFormData({ ...formData, keterangan: e.target.value })} />
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}