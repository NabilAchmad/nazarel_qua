'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch('/api/keuangan/summary')
            .then((res) => res.json())
            .then((data) => setStats(data));
    }, []);

    if (!stats) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="p-8 max-w-7xl mx-auto text-gray-800">
                <h1 className="text-3xl font-bold mb-6">Dashboard Ringkasan</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                        <h3 className="text-gray-500">Total Pendapatan</h3>
                        <p className="text-2xl font-bold text-green-600">Rp {stats.totalPendapatan.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
                        <h3 className="text-gray-500">Total Pengeluaran</h3>
                        <p className="text-2xl font-bold text-red-600">Rp {stats.totalPengeluaran.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                        <h3 className="text-gray-500">Laba Bersih</h3>
                        <p className="text-2xl font-bold text-blue-600">Rp {stats.labaBersih.toLocaleString('id-ID')}</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-4">Transaksi Terbaru</h2>
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Tipe</th>
                                <th className="p-4">Keterangan</th>
                                <th className="p-4">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.history.map((item: any, idx: number) => (
                                <tr key={`${item.type}-${item.id}-${idx}`} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{new Date(item.tanggal).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs text-white ${item.type === 'PENDAPATAN' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="p-4">{item.keterangan}</td>
                                    <td className="p-4 font-bold">Rp {item.jumlah.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}