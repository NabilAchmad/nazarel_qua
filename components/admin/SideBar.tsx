'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Wallet, FileBarChart,
  MessageSquare, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Katalog Produk', href: '/admin/katalog', icon: ShoppingBag },
  { name: 'Keuangan', href: '/admin/keuangan', icon: Wallet },
  { name: 'Laporan', href: '/admin/laporan', icon: FileBarChart },
  { name: 'Testimoni', href: '/admin/testimoni', icon: MessageSquare },
];

export default function Sidebar({ isOpen, onClose, isCollapsed, toggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay Gelap (Hanya Mobile) */}
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
          "fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64"
        )}
      >
        {/* Header Sidebar */}
        <div className={clsx(
          "flex items-center h-16 border-b border-gray-100 transition-all",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          {/* --- LOGIK LOGO DISINI --- */}
          {!isCollapsed ? (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent whitespace-nowrap">
              Nazarel Admin
            </span>
          ) : (
            // TAMPILAN KECIL (Logo Icon)
            // Pastikan file 'logo.png' ada di folder public/
            <div className="relative w-8 h-8">
              <Image
                src="public/logo.png"  // Ganti sesuai nama file logo anda
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Tombol Tutup di Mobile */}
          <button onClick={onClose} className="lg:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-3 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={isCollapsed ? item.name : ''}
                className={clsx(
                  "flex items-center rounded-lg transition-all font-medium group relative",
                  isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3",
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={22} className={clsx("shrink-0", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />

                <span className={clsx(
                  "whitespace-nowrap transition-all duration-300 origin-left",
                  isCollapsed ? "hidden opacity-0 w-0" : "block opacity-100 w-auto"
                )}>
                  {item.name}
                </span>

                {isCollapsed && (
                  <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2 mb-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <div className={clsx(
            "flex items-center rounded-lg bg-gray-50 border border-gray-100 transition-all",
            isCollapsed ? "justify-center p-2" : "gap-3 p-3"
          )}>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              A
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-700 truncate">Admin</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}