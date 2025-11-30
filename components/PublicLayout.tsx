// components/PublicLayout.tsx
'use client';

import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Navbar Tetap */}
            <PublicNavbar />

            {/* Konten Utama (diberi padding-top agar tidak tertutup navbar) */}
            <main className="flex-1 pt-16">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}