// components/Footer.tsx
'use client';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 p\y-12 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">💧 Nazarel Qua</h3>
                <p className="max-w-md mx-auto text-slate-400 mb-8">
                    Menyediakan air minum berkualitas tinggi, murni, dan higienis untuk kesehatan keluarga Anda setiap hari.
                </p>
                <div className="border-t border-slate-800 pt-8 text-sm">
                    <p>© {new Date().getFullYear()} Depot Air Minum Nazarel Qua. All rights reserved.</p>
                    <p className="mt-2 text-slate-500">Melayani dengan Sepenuh Hati.</p>
                </div>
            </div>
        </footer>
    );
}