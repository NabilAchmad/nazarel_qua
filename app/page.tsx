// app/page.tsx
import { prisma } from '@/lib/prisma';
import PublicLayout from '@/components/PublicLayout';
import AnimatedHero from '@/components/AnimatedHero';
// Import komponen baru
import TestimonialSection from '@/components/TestimonialSection';
import {
  MapPin, Clock, ShieldCheck, Droplets, Truck,
  Star, ChevronRight, MessageCircle, CheckCircle, HelpCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Ambil Produk
  const products = await prisma.produk.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 2. Ambil Testimoni Terbaru untuk Data Awal
  const reviews = await prisma.testimoni.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4
  });

  const whatsappNumber = "6281367995046";
  const waLink = (text: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  return (
    <PublicLayout>
      {/* ... (BAGIAN HERO, VALUE PROP, KATALOG TETAP SAMA SEPERTI SEBELUMNYA) ... */}

      {/* ... [PASTE BAGIAN HERO & KATALOG DARI KODE SEBELUMNYA DI SINI] ... */}
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 pt-10 pb-20 overflow-hidden">
        {/* ... (Isi Hero sama seperti kode sebelumnya) ... */}
        <AnimatedHero /> {/* Placeholder: Pastikan struktur hero lengkap ada di sini */}
      </section>

      {/* Katalog Section (Singkat untuk konteks) */}
      <section id="katalog" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          {/* ... (Loop produk sama seperti kode sebelumnya) ... */}
          {/* Agar tidak terlalu panjang di chat, saya asumsikan bagian ini Anda copy dari kode sebelumnya */}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* GANTI BAGIAN SECTION TESTIMONI LAMA DENGAN INI: */}

      <TestimonialSection initialData={reviews} />

      {/* ---------------------------------------------------- */}

      {/* ... (BAGIAN TENTANG KAMI, FAQ, FAB TETAP SAMA) ... */}
      <section id="tentang-kami" className="py-20 bg-slate-900 text-white relative">
        {/* ... */}
      </section>

      <section className="py-20 bg-white">
        {/* FAQ ... */}
      </section>

      {/* FAB */}
      <a href={waLink("Pesan")} className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2">
        <MessageCircle />
      </a>

    </PublicLayout>
  );
}