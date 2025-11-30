'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Laporan() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/keuangan').then(r => r.json()).then(res => {
            // Aggregate data for chart (simple daily sum)
            const agg: Record<string, any> = {};
            res.forEach((t: any) => {
                const date = new Date(t.tanggal).toLocaleDateString();
                if (!agg[date]) agg[date] = { name: date, pendapatan: 0, pengeluaran: 0 };
                if (t.type === 'PENDAPATAN') agg[date].pendapatan += t.jumlah;
                else agg[date].pengeluaran += t.jumlah;
            });
            // Convert to array and take last 7 entries for simplicity
            setData(Object.values(agg).slice(0, 7));
        });
    }, []);

    const handleExport = () => {
        // Simple CSV Export
        const headers = ['Tanggal', 'Pendapatan', 'Pengeluaran'];
        const rows = data.map(d => [d.name, d.pendapatan, d.pengeluaran]);
        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "laporan_nazarel_qua.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
                    <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">Ekspor CSV</button>
                </div>

                <div className="bg-white p-6 rounded shadow h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pendapatan" fill="#22c55e" name="Pendapatan" />
                            <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}