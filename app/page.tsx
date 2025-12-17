import { prisma } from '@/lib/prisma';
import PublicLayout from '@/components/PublicLayout';
import TestimonialSection from '@/components/TestimonialSection';
import ProductCard from '@/components/ProductCard';
import {
  MapPin, Clock, ShieldCheck, Droplets, Truck,
  ChevronRight, MessageCircle, CheckCircle, Award, Users
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Fetch Produk
  const products = await prisma.produk.findMany({ orderBy: { createdAt: 'desc' } });
  
  // 2. Fetch Ulasan
  const reviews = await prisma.testimoni.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });

  // 3. Fetch Statistik Galon Terjual
  let stats = await prisma.statistik.findUnique({ where: { id: 1 } });
  const galonSold = stats ? stats.totalGalon : 5000;

  const whatsappNumber = "6281367995046";
  const waLink = (text: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  return (
    <PublicLayout>

      {/* 1. HERO SECTION */}
      <section id="home" className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-24 pb-36 overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 text-blue-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Award size={14} className="text-yellow-400" /> Depot Air Minum Premium
              </div> */}
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                Kesegaran Murni <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                  Tanpa Kompromi.
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                Hadirkan kesehatan di tengah keluarga Anda dengan air minum yang diproses melalui teknologi <strong>Bio-Energy & UV Sterilization</strong>. Jernih, higienis, dan teruji laboratorium.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#katalog" 
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-900/50 flex justify-center items-center gap-2"
                >
                  Pesan Sekarang <ChevronRight size={18} />
                </a>
                <a 
                  href="#tentang-kami" 
                  className="px-8 py-4 bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 rounded-xl font-bold transition flex justify-center items-center"
                >
                  Pelajari Prosesnya
                </a>
              </div>

            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800/50 group">
                  <img 
                    src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop" 
                    alt="Nazarel Qua Premium Water" 
                    className="w-full h-[550px] object-cover hover:scale-105 transition duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="bg-green-500/20 p-2 rounded-full text-green-400"><ShieldCheck size={20}/></div>
                          <div>
                              <p className="text-sm font-bold text-white">Higienitas Terjamin</p>
                              <p className="text-xs text-slate-400">Standar Kesehatan RI</p>
                          </div>
                      </div>
                      <div className="text-blue-400 font-bold text-xs uppercase tracking-wide">Premium Quality</div>
                  </div>
               </div>
               <div className="absolute -inset-4 bg-blue-500/20 rounded-[2rem] blur-2xl -z-10"></div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US */}
      <section className="py-24 bg-white relative -mt-10 rounded-t-[3rem] z-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Kenapa Harus Nazarel Qua?</h2>
            <p className="text-slate-500 text-lg">Kami tidak hanya menjual air, kami menjual jaminan kesehatan dan kenyamanan untuk keluarga Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition duration-300 group">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Droplets size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Teknologi Filtrasi 7 Tahap</h3>
                <p className="text-slate-600 leading-relaxed">
                    Air melalui 7 tahap penyaringan mikro dan makro untuk menghilangkan partikel berbahaya, memastikan kemurnian 99.9%.
                </p>
            </div>

            <div className="p-8 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 transform md:-translate-y-4">
                <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sterilisasi UV & Ozon</h3>
                <p className="text-blue-100 leading-relaxed">
                    Perlindungan ganda membunuh bakteri dan virus tanpa mengubah rasa alami air. Aman untuk bayi dan lansia.
                </p>
            </div>

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

      {/* 3. KATALOG (YANG DIUBAH) */}
      <section id="katalog" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          
          {/* HEADER SECTION - CENTERED & RESIZED */}
          <div className="text-center max-w-3xl mx-auto mb-16">
             {/* Tulisan Katalog Produk Besar */}
             <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
               Katalog Produk
             </h2>
             
             {/* Garis Aksen Biru */}
             <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div>

             {/* Tulisan Pilih Kebutuhan Kecil (Subtitle) */}
             <p className="text-lg text-slate-500">
                Pilih kebutuhan air minum Anda. Tersedia layanan antar ke rumah atau jemput sendiri di depot kami dengan harga spesial.
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

      {/* 4. TESTIMONI */}
      <TestimonialSection initialData={reviews} />

      {/* 5. LOCATION & INFO */}
      <section id="tentang-kami" className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16">
            
            <div className="w-full lg:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Kunjungi Depot Kami</h2>
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
               <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group">
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

      {/* 6. FAQ */}
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

      {/* FAB WHATSAPP */}
      <a
        href={waLink("Halo, saya mau pesan air.")}
        target="_blank"
        className="fixed bottom-8 right-8 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl shadow-green-200/50 transition-all hover:scale-110 group flex items-center gap-0 hover:gap-3 overflow-hidden"
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