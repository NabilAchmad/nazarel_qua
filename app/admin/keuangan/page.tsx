'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Filter, X } from 'lucide-react';

export default function Keuangan() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('ALL');

    const [formData, setFormData] = useState({
        type: 'PENDAPATAN',
        tanggal: new Date().toISOString().split('T')[0],
        jumlah: 0,
        keterangan: ''
    });

    const fetchTrans = () => fetch('/api/keuangan').then(r => r.json()).then(setTransactions);

    useEffect(() => { fetchTrans(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/keuangan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setIsModalOpen(false);
        setFormData({ ...formData, jumlah: 0, keterangan: '' });
        fetchTrans();
    };

    const handleDelete = async (id: number, type: string) => {
        if (!confirm("Hapus transaksi ini?")) return;
        await fetch(`/api/keuangan/${id}?type=${type}`, { method: 'DELETE' });
        fetchTrans();
    };

    const filtered = transactions.filter(t => filterType === 'ALL' || t.type === filterType);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Data Keuangan</h1>
                    <p className="text-gray-500 text-sm">Catat semua pemasukan dan pengeluaran.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition">
                    <Plus size={18} /> Transaksi Baru
                </button>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-200 w-fit">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-transparent text-sm focus:outline-none cursor-pointer"
                >
                    <option value="ALL">Semua Transaksi</option>
                    <option value="PENDAPATAN">Pemasukan</option>
                    <option value="PENGELUARAN">Pengeluaran</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                            <tr>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Tipe</th>
                                <th className="p-4">Keterangan</th>
                                <th className="p-4">Jumlah</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Tidak ada data transaksi.</td></tr>
                            ) : (
                                filtered.map((t, idx) => (
                                    <tr key={`${t.type}-${t.id}-${idx}`} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-gray-600">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.type === 'PENDAPATAN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {t.type === 'PENDAPATAN' ? 'PEMASUKAN' : 'PENGELUARAN'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-800">{t.keterangan}</td>
                                        <td className={`p-4 font-bold ${t.type === 'PENDAPATAN' ? 'text-green-600' : 'text-red-600'}`}>
                                            Rp {t.jumlah.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDelete(t.id, t.type)} className="text-gray-400 hover:text-red-600 transition">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Catat Transaksi</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Transaksi</label>
                                <select className="w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="PENDAPATAN">Pemasukan (+)</option>
                                    <option value="PENGELUARAN">Pengeluaran (-)</option>
                                </select>
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