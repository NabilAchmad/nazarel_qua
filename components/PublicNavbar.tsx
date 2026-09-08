// components/PublicNavbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function PublicNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-ocean-900/90 backdrop-blur-md shadow-lg border-b border-ocean-800 py-3" : "bg-transparent py-5"
        )}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo / Brand */}
                <div
                    onClick={() => scrollToSection('home')}
                    className="cursor-pointer font-extrabold text-2xl text-white flex items-center gap-2"
                >
                    Nazarel<span className="text-gold-500">.</span>
                </div>

                {/* Menu Links */}
                <div className="hidden md:flex items-center gap-8 font-medium text-ocean-100">
                    <button
                        onClick={() => scrollToSection('home')}
                        className="hover:text-gold-400 transition"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => scrollToSection('katalog')}
                        className="hover:text-gold-400 transition"
                    >
                        Katalog
                    </button>
                    <button
                        onClick={() => scrollToSection('tentang-kami')}
                        className="hover:text-gold-400 transition"
                    >
                        Tentang Kami & Lokasi
                    </button>
                </div>

                {/* Login Button */}
                <Link
                    href="/auth/login"
                    className="px-6 py-2 bg-gold-500 text-ocean-900 rounded-full font-bold hover:bg-gold-400 transition shadow-lg shadow-gold-500/20"
                >
                    Login Admin
                </Link>
            </div>
        </nav>
    );
}