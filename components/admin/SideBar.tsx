// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Wallet, FileBarChart, LogOut, X, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Katalog Produk', href: '/admin/katalog', icon: ShoppingBag },
    { name: 'Keuangan', href: '/admin/keuangan', icon: Wallet },
    { name: 'Laporan', href: '/admin/laporan', icon: FileBarChart },
    { name: 'Testimoni', href: '/admin/testimoni', icon: MessageSquare },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay Gelap untuk Mobile */}
            <div
                className={clsx(
                    "fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        Nazarel Admin
                    </span>
                    <button onClick={onClose} className="lg:hidden text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()} // Tutup sidebar di mobile saat klik link
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar (Logout) */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    {/* Tombol Logout akan ditangani lewat API di TopBar atau di sini, 
                 tapi untuk UX lebih baik di sini juga ada info user */}
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-700">Admin</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}