'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { UploadCloud, X, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

export default function Katalog() {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Form
    const [formData, setFormData] = useState({ nama: '', deskripsi: '', harga: 0, gambarUrl: '' });
    const [editId, setEditId] = useState<number | null>(null);

    // State Loading
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = () => fetch('/api/produk').then(r => r.json()).then(setProducts);

    useEffect(() => { fetchProducts(); }, []);

    // --- FUNGSI UPLOAD GAMBAR ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) throw new Error("Upload failed");

            const result = await res.json();
            // Simpan URL gambar ke state form
            setFormData(prev => ({ ...prev, gambarUrl: result.url }));
        } catch (error) {
            alert("Gagal mengupload gambar. Pastikan file tidak terlalu besar.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    // --- CRUD HANDLERS ---
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
            console.error("Error saving product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;
        await fetch(`/api/produk/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    const openEdit = (p: any) => {
        setEditId(p.id);
        setFormData({
            nama: p.nama,
            deskripsi: p.deskripsi || '',
            harga: p.harga,
            gambarUrl: p.gambarUrl || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ nama: '', deskripsi: '', harga: 0, gambarUrl: '' });
        setIsUploading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="p-8 max-w-7xl mx-auto text-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Katalog Produk</h1>
                        <p className="text-sm text-gray-500">Tambah, edit, atau hapus produk depot.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow transition"
                    >
                        <span>+ Tambah Produk</span>
                    </button>
                </div>

                {/* Tabel Produk */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 w-24">Gambar</th>
                                    <th className="p-4 font-semibold text-gray-600">Nama Produk</th>
                                    <th className="p-4 font-semibold text-gray-600">Harga</th>
                                    <th className="p-4 font-semibold text-gray-600">Deskripsi</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            Belum ada produk. Silakan tambah produk baru.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4">
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                                                    {p.gambarUrl ? (
                                                        <img src={p.gambarUrl} alt={p.nama} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="text-gray-400" size={24} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-gray-900">{p.nama}</td>
                                            <td className="p-4 text-blue-600 font-semibold">
                                                Rp {p.harga.toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm max-w-xs truncate">
                                                {p.deskripsi || '-'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(p)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                                        title="Hapus"
                                                    >
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

                {/* Modal Tambah / Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl transform transition-all scale-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {editId ? 'Edit Produk' : 'Tambah Produk Baru'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Input Nama */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Contoh: Galon Isi Ulang"
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={formData.nama}
                                        onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                    />
                                </div>

                                {/* Input Harga */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={formData.harga || ''}
                                        onChange={e => setFormData({ ...formData, harga: parseFloat(e.target.value) })}
                                    />
                                </div>

                                {/* Input Deskripsi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                    <textarea
                                        placeholder="Keterangan singkat produk..."
                                        rows={3}
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={formData.deskripsi}
                                        onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                                    />
                                </div>

                                {/* Input Upload Gambar */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto Produk</label>

                                    <div className="flex flex-col gap-3">
                                        {/* Area Tombol Upload */}
                                        <label className={`
                                            flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition
                                            ${isUploading ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'}
                                        `}>
                                            <UploadCloud className={isUploading ? 'animate-bounce text-gray-500' : 'text-blue-500'} />
                                            <span className="text-sm font-medium text-gray-600">
                                                {isUploading ? 'Sedang mengupload...' : 'Klik untuk Upload Foto'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                            />
                                        </label>

                                        {/* Preview Gambar */}
                                        {formData.gambarUrl && (
                                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                                <img
                                                    src={formData.gambarUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gambarUrl: '' })}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition transform hover:scale-110"
                                                    title="Hapus Foto"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading || isLoading}
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}