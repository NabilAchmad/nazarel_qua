// components/admin/TopBar.tsx
'use client';

import { Menu, LogOut, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
    onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/'); // Redirect ke home publik
        router.refresh();
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-md hover:bg-gray-100 lg:hidden text-gray-600"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-gray-700 font-semibold hidden sm:block">
                    Depot Air Minum Nazarel Qua
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifikasi (Dummy) */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Tombol Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Keluar</span>
                </button>
            </div>
        </header>
    );
}