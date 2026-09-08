// components/admin/TopBar.tsx
'use client';

import { Menu, LogOut, Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
    onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shadow-sm transition-all">
            <div className="flex items-center gap-6">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 lg:hidden text-slate-700 transition"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-slate-800 text-xl font-bold tracking-tight hidden sm:block">
                    Depot Air Minum <span className="text-ocean-600">Nazarel Qua</span>
                </h2>
            </div>

            <div className="flex items-center gap-5">
                {/* Search Bar (Visual Only) */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 hover:bg-white hover:border-ocean-300 transition-colors">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input type="text" placeholder="Pencarian cepat..." className="bg-transparent border-none outline-none text-sm w-48 text-slate-700 placeholder:text-slate-400" />
                </div>

                {/* Notifikasi */}
                <button className="p-2.5 text-slate-500 bg-slate-100 hover:bg-ocean-50 hover:text-ocean-600 rounded-full relative transition">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>

                {/* Garis Pemisah */}
                <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

                {/* Tombol Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-semibold"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Keluar</span>
                </button>
            </div>
        </header>
    );
}