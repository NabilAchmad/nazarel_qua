'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';

export default function Keuangan() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('ALL');

    // State Modal
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
        if (!confirm("Yakin hapus?")) return;
        await fetch(`/api/keuangan/${id}?type=${type}`, { method: 'DELETE' });
        fetchTrans();
    };

    const filtered = transactions.filter(t => filterType === 'ALL' || t.type === filterType);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Keuangan (Pendapatan & Pengeluaran)</h1>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Transaksi Baru</button>
                </div>

                <div className="mb-4">
                    <label className="font-bold mr-2">Filter:</label>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border p-1 rounded">
                        <option value="ALL">Semua</option>
                        <option value="PENDAPATAN">Pendapatan</option>
                        <option value="PENGELUARAN">Pengeluaran</option>
                    </select>
                </div>

                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Tipe</th>
                                <th className="p-4">Keterangan</th>
                                <th className="p-4">Jumlah</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((t, idx) => (
                                <tr key={`${t.type}-${t.id}-${idx}`} className="border-b">
                                    <td className="p-4">{new Date(t.tanggal).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs text-white ${t.type === 'PENDAPATAN' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="p-4">{t.keterangan}</td>
                                    <td className="p-4 font-bold">Rp {t.jumlah.toLocaleString('id-ID')}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleDelete(t.id, t.type)} className="text-red-500 hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal Transaksi */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Tambah Transaksi</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <select className="w-full border p-2 rounded"
                                    value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="PENDAPATAN">PENDAPATAN</option>
                                    <option value="PENGELUARAN">PENGELUARAN</option>
                                </select>
                                <input required type="date" className="w-full border p-2 rounded"
                                    value={formData.tanggal} onChange={e => setFormData({ ...formData, tanggal: e.target.value })} />
                                <input required type="number" placeholder="Jumlah" className="w-full border p-2 rounded"
                                    value={formData.jumlah} onChange={e => setFormData({ ...formData, jumlah: parseFloat(e.target.value) })} />
                                <input required placeholder="Keterangan" className="w-full border p-2 rounded"
                                    value={formData.keterangan} onChange={e => setFormData({ ...formData, keterangan: e.target.value })} />

                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}