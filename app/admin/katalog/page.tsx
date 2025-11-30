'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';

export default function Katalog() {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ nama: '', deskripsi: '', harga: 0, gambarUrl: '' });
    const [editId, setEditId] = useState<number | null>(null);

    const fetchProducts = () => fetch('/api/produk').then(r => r.json()).then(setProducts);

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editId ? `/api/produk/${editId}` : '/api/produk';
        const method = editId ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        setIsModalOpen(false);
        setEditId(null);
        setFormData({ nama: '', deskripsi: '', harga: 0, gambarUrl: '' });
        fetchProducts();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin hapus?")) return;
        await fetch(`/api/produk/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    const openEdit = (p: any) => {
        setEditId(p.id);
        setFormData({ nama: p.nama, deskripsi: p.deskripsi, harga: p.harga, gambarUrl: p.gambarUrl || '' });
        setIsModalOpen(true);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="p-8 max-w-7xl mx-auto text-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Kelola Katalog Produk</h1>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Tambah Produk</button>
                </div>

                <div className="bg-white rounded shadow overflow-x-auto text-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4">Deskripsi</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b">
                                    <td className="p-4">{p.nama}</td>
                                    <td className="p-4">Rp {p.harga.toLocaleString('id-ID')}</td>
                                    <td className="p-4">{p.deskripsi}</td>
                                    <td className="p-4 flex gap-2">
                                        <button onClick={() => openEdit(p)} className="text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal Sederhana */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Produk' : 'Tambah Produk'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input required placeholder="Nama Produk" className="w-full border p-2 rounded"
                                    value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} />
                                <input required type="number" placeholder="Harga" className="w-full border p-2 rounded"
                                    value={formData.harga} onChange={e => setFormData({ ...formData, harga: parseFloat(e.target.value) })} />
                                <textarea placeholder="Deskripsi" className="w-full border p-2 rounded"
                                    value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} />
                                <input placeholder="URL Gambar (Opsional)" className="w-full border p-2 rounded"
                                    value={formData.gambarUrl} onChange={e => setFormData({ ...formData, gambarUrl: e.target.value })} />
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