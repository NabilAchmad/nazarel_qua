'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/SideBar';
import TopBar from '@/components/admin/TopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Untuk Mobile
    const [isCollapsed, setIsCollapsed] = useState(false);     // Untuk Desktop

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
                {/* Top Header */}
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Page Content (Scrollable) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}