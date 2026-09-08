'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Wallet, FileBarChart,
  MessageSquare, Activity, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

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
  { name: 'Log Aktivitas', href: '/admin/logs', icon: Activity },
];

export default function Sidebar({ isOpen, onClose, isCollapsed, toggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay Gelap (Hanya Mobile) */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-ocean-900/60 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 bg-ocean-900 border-r border-ocean-800 shadow-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64"
        )}
      >
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-gold-500/10 to-transparent blur-3xl pointer-events-none"></div>

        {/* Header Sidebar */}
        <div className={clsx(
          "flex items-center h-20 border-b border-ocean-800 transition-all relative z-10",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          {!isCollapsed ? (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2"
            >
              Nazarel<span className="text-gold-500">.</span>
            </motion.span>
          ) : (
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center font-extrabold text-ocean-900 text-xl shadow-lg shadow-gold-500/20">
              N
            </div>
          )}

          {/* Tombol Tutup di Mobile */}
          <button onClick={onClose} className="lg:hidden text-ocean-300 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
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
                  "flex items-center rounded-xl transition-all duration-300 font-medium group relative overflow-hidden",
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3.5",
                  isActive
                    ? "bg-gradient-to-r from-gold-500 to-gold-400 text-ocean-900 shadow-md shadow-gold-500/20"
                    : "text-ocean-200 hover:bg-ocean-800 hover:text-white"
                )}
              >
                {/* Efek Hover Light */}
                {!isActive && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}

                <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={clsx(
                        "shrink-0 z-10 transition-transform duration-300", 
                        isActive ? "text-ocean-900 scale-110" : "text-ocean-400 group-hover:text-gold-400 group-hover:scale-110"
                    )} 
                />

                <span className={clsx(
                  "whitespace-nowrap transition-all duration-300 origin-left z-10",
                  isCollapsed ? "hidden opacity-0 w-0" : "block opacity-100 w-auto",
                  isActive ? "font-bold" : ""
                )}>
                  {item.name}
                </span>

                {isCollapsed && (
                  <div className="absolute left-16 bg-ocean-800 text-white text-sm font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap shadow-xl border border-ocean-700">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-ocean-800 relative z-10 bg-ocean-900/50 backdrop-blur-sm">
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-center py-3 mb-4 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-ocean-300 hover:text-white transition-all shadow-inner border border-ocean-700/50"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <div className={clsx(
            "flex items-center rounded-2xl bg-gradient-to-br from-ocean-800 to-ocean-900 border border-ocean-700 transition-all shadow-lg",
            isCollapsed ? "justify-center p-2" : "gap-3 p-3"
          )}>
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-ocean-900 font-extrabold text-sm shrink-0 shadow-inner">
              A
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">Admin</p>
                <p className="text-xs text-ocean-300 truncate font-medium">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}