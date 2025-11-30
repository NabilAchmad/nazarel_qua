// app/admin/layout.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/Topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
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