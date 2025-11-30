// components/PublicNavbar.tsx
'use client';

import Link from 'next/link';

export default function PublicNavbar() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-md z-50 transition-all">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo / Brand */}
                <div
                    onClick={() => scrollToSection('home')}
                    className="cursor-pointer font-bold text-2xl text-blue-600 flex items-center gap-2"
                >
                    💧 Nazarel Qua
                </div>

                {/* Menu Links */}
                <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
                    <button
                        onClick={() => scrollToSection('home')}
                        className="hover:text-blue-600 transition"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => scrollToSection('katalog')}
                        className="hover:text-blue-600 transition"
                    >
                        Katalog
                    </button>
                    <button
                        onClick={() => scrollToSection('tentang-kami')}
                        className="hover:text-blue-600 transition"
                    >
                        Tentang Kami & Lokasi
                    </button>
                </div>

                {/* Login Button */}
                <Link
                    href="/auth/login"
                    className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    Login Admin
                </Link>
            </div>
        </nav>
    );
}