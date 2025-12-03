// app/page.tsx
import { prisma } from '@/lib/prisma';
import PublicLayout from '@/components/PublicLayout';
import TestimonialSection from '@/components/TestimonialSection';
import ProductCard from '@/components/ProductCard';
import {
  MapPin, Clock, ShieldCheck, Droplets, Truck,
  Star, ChevronRight, MessageCircle, CheckCircle, Award, Users
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch Data
  const products = await prisma.produk.findMany({ orderBy: { createdAt: 'desc' } });
  const reviews = await prisma.testimoni.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });

  const whatsappNumber = "6281367995046";
  const waLink = (text: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  return (
    <PublicLayout>

      {/* 1. HERO SECTION: Clean & Corporate Look */}
      <section id="home" className="relative bg-slate-50 pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Shapes (Subtle) */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[500px] h-[500px] bg-cyan-100/50 rounded-full blur-3xl opacity-60"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
                <Award size={14} /> Depot Air Minum Premium
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Kesegaran Murni <br/>
                <span className="text-blue-600">Tanpa Kompromi.</span>
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Hadirkan kesehatan di tengah keluarga Anda dengan air minum yang diproses melalui teknologi <strong>Bio-Energy & UV Sterilization</strong>. Jernih, higienis, dan teruji laboratorium.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#katalog" 
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
                >
                  Pesan Sekarang <ChevronRight size={18} />
                </a>
                <a 
                  href="#tentang-kami" 
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition flex justify-center items-center"
                >
                  Pelajari Prosesnya
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-200 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-slate-900">5k+</p>
                  <p className="text-sm text-slate-500">Galon Terjual</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">99%</p>
                  <p className="text-sm text-slate-500">Pelanggan Puas</p>
                </div>
              </div>
            </div>

            {/* Right Image (Clean Mockup Look) */}
            <div className="w-full lg:w-1/2 relative animate-in fade-in zoom-in duration-1000 delay-200">
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  {/* Ganti src ini dengan foto galon/depot asli yang berkualitas tinggi */}
                  <img 
                    src="https://images.unsplash.com/photo-1625126596395-359247cc92e4?q=80&w=1000&auto=format&fit=crop" 
                    alt="Nazarel Qua Premium Water" 
                    className="w-full h-[500px] object-cover hover:scale-105 transition duration-700"
                  />
                  {/* Glassmorphism Badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full text-green-600"><ShieldCheck size={20}/></div>
                          <div>
                              <p className="text-sm font-bold text-slate-800">Higienitas Terjamin</p>
                              <p className="text-xs text-slate-500">Standar Kesehatan RI</p>
                          </div>
                      </div>
                      <div className="text-blue-600 font-bold text-sm">Lihat Sertifikat &rarr;</div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US (Bento Grid Style) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Kenapa Harus Nazarel Qua?</h2>
            <p className="text-slate-500 text-lg">Kami tidak hanya menjual air, kami menjual jaminan kesehatan dan kenyamanan untuk keluarga Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition duration-300 group">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Droplets size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Teknologi Filtrasi 7 Tahap</h3>
                <p className="text-slate-600 leading-relaxed">
                    Air melalui 7 tahap penyaringan mikro dan makro untuk menghilangkan partikel berbahaya, memastikan kemurnian 99.9%.
                </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 transform md:-translate-y-4">
                <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sterilisasi UV & Ozon</h3>
                <p className="text-blue-100 leading-relaxed">
                    Perlindungan ganda membunuh bakteri dan virus tanpa mengubah rasa alami air. Aman untuk bayi dan lansia.
                </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition duration-300 group">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Truck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Layanan Antar Cepat</h3>
                <p className="text-slate-600 leading-relaxed">
                    Tim kurir kami siap mengantar pesanan ke depan pintu Anda dalam waktu singkat. Gratis ongkir untuk area terdekat.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KATALOG (Minimalist) */}
      <section id="katalog" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
             <div>
                <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Katalog Produk</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Pilih Kebutuhan Anda</h2>
             </div>
             <p className="text-slate-500 max-w-md text-right hidden md:block">
                Tersedia layanan antar ke rumah atau jemput sendiri di depot kami dengan harga spesial.
             </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400">Belum ada produk yang ditampilkan saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((prod) => (
                <ProductCard 
                    key={prod.id} 
                    product={{ ...prod, harga: prod.harga.toNumber() }} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. TESTIMONI (Menggunakan Component yang sudah dibuat) */}
      <TestimonialSection initialData={reviews} />

      {/* 5. LOCATION & INFO (Dark Professional Theme) */}
      <section id="tentang-kami" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16">
            
            <div className="w-full lg:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Kunjungi Depot Kami</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Lihat langsung proses pengisian ulang air minum yang higienis dan transparan. Kami menjunjung tinggi kebersihan untuk kepercayaan Anda.
              </p>
              
              <div className="space-y-6">
                 <InfoRow icon={<MapPin className="text-blue-400"/>} title="Alamat" text="Maur Baru, Kec. Rupit, Kab. Musi Rawas Utara, Sumatera Selatan" />
                 <InfoRow icon={<Clock className="text-blue-400"/>} title="Jam Operasional" text="Senin - Minggu: 07.00 - 21.00 WIB" />
                 <InfoRow icon={<Users className="text-blue-400"/>} title="Layanan Pelanggan" text="Siap melayani via WhatsApp & Telepon" />
              </div>

              <div className="pt-6">
                 <a href={waLink("Halo, saya ingin bertanya tentang layanan air minum.")} target="_blank" className="inline-flex items-center gap-2 text-white font-bold hover:text-blue-400 transition">
                    Hubungi Kami Sekarang <ChevronRight size={16}/>
                 </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
               <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.149988611509!2d102.863102!3d-2.7719429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e304b139e0c3edf%3A0xbaee141b1049ede5!2sNazarel%20Qua!5e0!3m2!1sid!2sid!4v1764495166470!5m2!1sid!2sid"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" 
                    className="filter grayscale group-hover:grayscale-0 transition duration-700"
                  ></iframe>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ (Clean Accordion Look) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Pertanyaan Umum</h2>
          <div className="space-y-4 text-left">
            <FaqItem q="Apakah galon diantar sampai ke dalam rumah?" a="Ya, kurir kami akan membantu mengangkat galon hingga ke tempat dispenser Anda." />
            <FaqItem q="Berapa minimal pemesanan untuk diantar?" a="Tidak ada minimal untuk jarak dekat (sekitar Maur Baru). Untuk jarak jauh menyesuaikan." />
            <FaqItem q="Apakah menerima pencucian galon kotor?" a="Tentu, setiap galon isi ulang akan melalui proses penyikatan dan sterilisasi sebelum diisi." />
          </div>
        </div>
      </section>

      {/* FAB WHATSAPP (Modern Style) */}
      <a
        href={waLink("Halo, saya mau pesan air.")}
        target="_blank"
        className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-200 transition-all hover:scale-110 group flex items-center gap-0 hover:gap-3 overflow-hidden"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100">
            Chat Admin
        </span>
      </a>

    </PublicLayout>
  );
}

// --- SUB COMPONENTS ---

function InfoRow({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">{icon}</div>
            <div>
                <h4 className="text-lg font-bold text-white">{title}</h4>
                <p className="text-slate-400">{text}</p>
            </div>
        </div>
    )
}

function FaqItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-slate-100 transition cursor-default">
      <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-3">
        <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">?</span>
        {q}
      </h5>
      <p className="text-slate-600 pl-9 leading-relaxed">{a}</p>
    </div>
  );
}