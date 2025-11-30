'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">Depot Nazarel Qua Admin</h1>
            <nav className="flex gap-4">
                <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
                <Link href="/admin/katalog" className="hover:underline">Katalog</Link>
                <Link href="/admin/keuangan" className="hover:underline">Keuangan</Link>
                <Link href="/admin/laporan" className="hover:underline">Laporan</Link>
                <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
            </nav>
        </header>
    );
}