'use client';
import { useState, useEffect } from 'react';
import { UploadCloud, X, Edit, Trash2, Image as ImageIcon, Plus } from 'lucide-react';

export default function Katalog() {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form & UI States
    const [formData, setFormData] = useState({ nama: '', deskripsi: '', harga: 0, gambarUrl: '' });
    const [editId, setEditId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = () => fetch('/api/produk').then(r => r.json()).then(setProducts);

    useEffect(() => { fetchProducts(); }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setIsUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data });
            if (!res.ok) throw new Error("Upload failed");
            const result = await res.json();
            setFormData(prev => ({ ...prev, gambarUrl: result.url }));
        } catch (error) {
            alert("Gagal upload gambar. Cek koneksi atau ukuran file.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const url = editId ? `/api/produk/${editId}` : '/api/produk';
        const method = editId ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            closeModal();
            fetchProducts();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus produk ini permanen?")) return;
        await fetch(`/api/produk/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    const openEdit = (p: any) => {
        setEditId(p.id);
        setFormData({ nama: p.nama, deskripsi: p.deskripsi || '', harga: p.harga, gambarUrl: p.gambarUrl || '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ nama: '', deskripsi: '', harga: 0, gambarUrl: '' });
        setIsUploading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Katalog Produk</h1>
                    <p className="text-gray-500 text-sm">Kelola daftar produk yang tampil di halaman depan.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
                >
                    <Plus size={18} /> Tambah Produk
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                            <tr>
                                <th className="p-4 w-24">Foto</th>
                                <th className="p-4">Nama Produk</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4">Deskripsi</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {products.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada data produk.</td></tr>
                            ) : (
                                products.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="w-12 h-12 rounded bg-gray-100 border overflow-hidden flex items-center justify-center">
                                                {p.gambarUrl ? (
                                                    <img src={p.gambarUrl} alt={p.nama} className="w-full h-full object-cover" />
                                                ) : <ImageIcon className="text-gray-400" size={20} />}
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{p.nama}</td>
                                        <td className="p-4 text-blue-600 font-semibold">Rp {p.harga.toLocaleString('id-ID')}</td>
                                        <td className="p-4 text-gray-500 max-w-xs truncate">{p.deskripsi || '-'}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={16} /></button>
                                            </div>
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
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">{editId ? 'Edit Produk' : 'Produk Baru'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                <input required type="text" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                                <input required type="number" min="0" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.harga || ''} onChange={e => setFormData({ ...formData, harga: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea rows={3} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                                <div className="flex items-center gap-3">
                                    <label className={`flex items-center justify-center px-4 py-2 border border-dashed rounded-lg cursor-pointer ${isUploading ? 'bg-gray-100' : 'hover:bg-blue-50 border-blue-300'}`}>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <UploadCloud size={16} /> {isUploading ? 'Uploading...' : 'Pilih File'}
                                        </div>
                                    </label>
                                    {formData.gambarUrl && (
                                        <div className="h-10 w-10 relative rounded overflow-hidden border">
                                            <img src={formData.gambarUrl} alt="Preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={isUploading || isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}