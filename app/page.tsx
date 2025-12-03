// app/page.tsx
import { prisma } from '@/lib/prisma';
import PublicLayout from '@/components/PublicLayout';
// HAPUS import AnimatedHero karena sudah tidak dipakai
import TestimonialSection from '@/components/TestimonialSection'; 
import ProductCard from '@/components/ProductCard';
import {
  MapPin, Clock, ShieldCheck, Droplets, Truck,
  Star, ChevronRight, MessageCircle, CheckCircle, HelpCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.produk.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const reviews = await prisma.testimoni.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  const whatsappNumber = "6281367995046";
  const waLink = (text: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  return (
    <PublicLayout>

      {/* 1. HERO SECTION BARU (TANPA ANIMATED HERO LAMA) */}
      <section id="home" className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 pt-16 pb-28 overflow-hidden">
        
        {/* Dekorasi Background Halus */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-cyan-300 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
            
            {/* Kiri: Teks Copywriting */}
            <div className="w-full md:w-1/2 text-white space-y-6 animate-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium text-cyan-50 shadow-sm">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span>Pilihan No. 1 Masyarakat Muratara</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
                Kesegaran <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
                  Alami & Murni
                </span>
              </h1>
              
              <p className="text-lg text-blue-50/90 leading-relaxed max-w-lg">
                Nikmati air minum berkualitas tinggi yang diproses dengan teknologi <strong>Bio-Energy & UV Sterilization</strong>. Higienis, sehat, dan menyegarkan setiap tegukan.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href={waLink("Halo, saya mau pesan air minum.")} 
                  target="_blank" 
                  className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-50 transition transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Pesan Sekarang <ChevronRight size={20} />
                </a>
                <a 
                  href="#tentang-kami" 
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition"
                >
                  Tentang Kami
                </a>
              </div>

              {/* Stats Bar */}
              <div className="pt-8 flex items-center gap-8 border-t border-white/10 mt-6">
                <div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="text-cyan-300" />
                    <p className="text-2xl font-bold">100%</p>
                  </div>
                  <p className="text-xs text-blue-100 mt-1">Lulus Uji Lab</p>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div>
                  <div className="flex items-center gap-1">
                    <Truck className="text-cyan-300" />
                    <p className="text-2xl font-bold">Cepat</p>
                  </div>
                  <p className="text-xs text-blue-100 mt-1">Antar Jemput</p>
                </div>
              </div>
            </div>

            {/* Kanan: VISUAL BARU (Gambar Galon/Air) */}
            <div className="w-full md:w-1/2 animate-in slide-in-from-right duration-700 delay-200 relative hidden md:block">
              <div className="relative z-10">
                {/* Gambar Utama (Placeholder Image Unsplash Air Bersih) */}
                <img 
                    src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop" 
                    alt="Air Mineral Segar Nazarel Qua" 
                    className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition duration-700 border-4 border-white/20 object-cover h-[500px] w-full"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Higienis Terjamin</p>
                        <p className="text-xs text-gray-500">Bebas Bakteri</p>
                    </div>
                </div>
              </div>

              {/* Elemen Dekorasi Belakang Gambar */}
              <div className="absolute top-10 right-10 w-full h-full bg-cyan-400 rounded-3xl -z-10 opacity-30 blur-lg transform rotate-6"></div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className="relative z-20 -mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<ShieldCheck size={40} className="text-blue-600" />}
              title="Teknologi Bio-Energy"
              desc="Filtrasi bertahap menjamin air bebas bakteri, jernih, dan aman dikonsumsi keluarga."
            />
            <FeatureCard
              icon={<Truck size={40} className="text-blue-600" />}
              title="Siap Antar Jemput"
              desc="Layanan praktis! Pesan dari rumah, kurir kami siap mengantar dan menjemput galon Anda."
            />
            <FeatureCard
              icon={<Droplets size={40} className="text-blue-600" />}
              title="Rasa Segar Alami"
              desc="Tidak berbau, tidak berasa tanah, dan memberikan kesegaran murni seperti air pegunungan."
            />
          </div>
        </div>
      </section>

      {/* 3. KATALOG PRODUK */}
      <section id="katalog" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs bg-blue-100 px-3 py-1 rounded-full">Layanan Isi Ulang</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">Solusi Air Minum Praktis</h2>
            <p className="text-slate-500 text-lg">
              Kami menyediakan layanan <strong>Isi Ulang Galon</strong> dengan pilihan metode yang fleksibel untuk Anda.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <p className="text-gray-500">Belum ada produk yang ditampilkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((prod) => (
                <ProductCard 
                    key={prod.id} 
                    product={{
                        ...prod,
                        harga: prod.harga.toNumber() 
                    }} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. TESTIMONI DINAMIS */}
      <TestimonialSection initialData={reviews} />

      {/* 5. TENTANG KAMI & LOKASI */}
      <section id="tentang-kami" className="py-20 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm">Tentang Kami</span>
                <h2 className="text-4xl font-bold mt-2 mb-6">Nazarel Qua</h2>
                <p className="text-slate-300 leading-relaxed text-lg text-justify">
                  Kami adalah depot air minum isi ulang yang berlokasi di <strong>Maur Baru, Kec. Rupit</strong>. 
                  Berdiri dengan komitmen untuk menyediakan air bersih yang sehat bagi masyarakat sekitar dengan harga terjangkau dan kualitas premium.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600/20 p-3 rounded-full text-blue-400"><CheckCircle size={24} /></div>
                  <div><h4 className="font-bold text-lg">Proses Steril</h4><p className="text-slate-400 text-sm">Menggunakan UV & Ozonisasi untuk membunuh kuman.</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600/20 p-3 rounded-full text-blue-400"><Clock size={24} /></div>
                  <div><h4 className="font-bold text-lg">Buka Setiap Hari</h4><p className="text-slate-400 text-sm">07.00 - 21.00 WIB</p></div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-slate-800 p-2 rounded-3xl shadow-2xl border border-slate-700">
                <div className="h-[400px] w-full rounded-2xl overflow-hidden relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.149988611509!2d102.863102!3d-2.7719429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e304b139e0c3edf%3A0xbaee141b1049ede5!2sNazarel%20Qua!5e0!3m2!1sid!2sid!4v1764495166470!5m2!1sid!2sid"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy"
                    className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition duration-500 opacity-90 hover:opacity-100"
                  ></iframe>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-cyan-400" />
                    <div>
                      <p className="text-sm font-bold text-white">Maur Baru, Rupit</p>
                      <p className="text-xs text-slate-400">Musi Rawas Utara</p>
                    </div>
                  </div>
                  <a href="https://maps.google.com/?q=Nazarel+Qua" target="_blank" className="text-xs bg-white text-slate-900 px-3 py-1.5 rounded font-bold hover:bg-gray-200">Buka Maps</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <HelpCircle size={40} className="text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Pertanyaan Umum</h2>
          <div className="text-left space-y-4">
            <FaqItem q="Apakah menerima jasa cuci galon?" a="Ya, setiap pengisian ulang sudah termasuk pembersihan bagian dalam dan luar galon." />
            <FaqItem q="Berapa lama pengantaran jika pesan Delivery?" a="Tergantung antrian, namun biasanya kami kirim dalam waktu 30-60 menit untuk area Maur Baru." />
            <FaqItem q="Apakah buka saat hari libur?" a="Kami buka setiap hari termasuk hari Minggu dan hari libur nasional." />
          </div>
        </div>
      </section>

      {/* FAB WHATSAPP */}
      <a
        href={waLink("Halo, saya mau pesan air.")}
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl shadow-green-400/50 hover:bg-green-600 hover:scale-110 transition duration-300 animate-bounce-slow flex items-center gap-2 group"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
          Chat WhatsApp
        </span>
      </a>

    </PublicLayout>
  );
}

// --- SUB COMPONENTS ---

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition duration-300">
      <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 text-xl mb-3">{title}</h4>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> {q}</h5>
      <p className="text-slate-500 text-sm pl-4">{a}</p>
    </div>
  );
}