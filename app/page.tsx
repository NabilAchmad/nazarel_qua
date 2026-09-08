'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';
import TestimonialSection from '@/components/TestimonialSection';
import ProductCard from '@/components/ProductCard';
import {
  MapPin, Clock, ShieldCheck, Droplets, Truck,
  ChevronRight, MessageCircle, CheckCircle, Award, Users,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data for homepage
    const fetchData = async () => {
      try {
        // Karena ini 'use client', kita panggil API yang sudah ada atau bikin dummy sementara.
        // Asumsi data diambil dari API. Di sini kita fetch langsung (butuh API endpoint)
        // Kita bisa pakai fallback dummy jika API gagal, atau biarkan kosong dulu.
        const resProducts = await fetch('/api/produk');
        if (resProducts.ok) {
            const data = await resProducts.json();
            setProducts(data);
        }
        
        const resReviews = await fetch('/api/testimoni');
        if(resReviews.ok) {
            const data = await resReviews.json();
            setReviews(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const whatsappNumber = "6281367995046";
  const waLink = (text: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  return (
    <PublicLayout>

      {/* 1. HERO SECTION */}
      <section id="home" className="relative bg-ocean-900 pt-28 pb-40 overflow-hidden">
        
        {/* Background Effects (Ocean & Sunset Gold) */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-ocean-600/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean-800/80 border border-ocean-700 text-gold-400 text-sm font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-ocean-900/50">
                <Sparkles size={16} /> Kualitas Premium
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                Kesegaran Murni <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
                  Tanpa Kompromi.
                </span>
              </h1>
              
              <p className="text-lg text-ocean-100 leading-relaxed max-w-lg opacity-90">
                Hadirkan kesehatan di tengah keluarga Anda dengan air minum yang diproses melalui teknologi <strong className="text-gold-400">Bio-Energy & UV Sterilization</strong>. Jernih, higienis, dan teruji secara klinis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <a 
                  href="#katalog" 
                  className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-ocean-900 rounded-2xl font-bold transition-all shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-1 flex justify-center items-center gap-2"
                >
                  Pesan Sekarang <ChevronRight size={20} />
                </a>
                <a 
                  href="#tentang-kami" 
                  className="px-8 py-4 bg-ocean-800/50 backdrop-blur-md border border-ocean-600 text-white hover:bg-ocean-700 hover:border-ocean-500 rounded-2xl font-bold transition-all flex justify-center items-center hover:-translate-y-1"
                >
                  Pelajari Prosesnya
                </a>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-full lg:w-1/2 relative hidden lg:block"
            >
               <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-ocean-800/50 group">
                  <div className="absolute inset-0 bg-ocean-900/20 group-hover:bg-transparent transition duration-700 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop" 
                    alt="Nazarel Qua Premium Water" 
                    className="w-full h-[600px] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute bottom-8 left-8 right-8 bg-ocean-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-ocean-700/50 flex items-center justify-between z-20 transform translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center gap-4">
                          <div className="bg-gold-500/20 p-3 rounded-xl text-gold-400"><ShieldCheck size={24}/></div>
                          <div>
                              <p className="text-base font-bold text-white">Higienitas Terjamin</p>
                              <p className="text-sm text-ocean-200">Standar Kesehatan Nasional</p>
                          </div>
                      </div>
                      <div className="text-gold-400 font-extrabold text-xs uppercase tracking-widest bg-gold-500/10 px-3 py-1.5 rounded-lg border border-gold-500/20">
                          100% PURE
                      </div>
                  </div>
               </div>
               {/* Glow effect behind image */}
               <div className="absolute -inset-10 bg-gradient-to-tr from-gold-500/20 to-ocean-500/20 rounded-full blur-3xl -z-10"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US */}
      <section className="py-24 bg-white relative -mt-16 rounded-t-[3rem] z-20 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Kenapa Harus Nazarel Qua?</h2>
            <p className="text-slate-500 text-lg">Kami tidak hanya menjual air, kami menjual jaminan kesehatan dan kenyamanan eksklusif untuk keluarga Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-12">
            <motion.div whileHover={{ y: -10 }} className="p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="w-16 h-16 bg-ocean-50 text-ocean-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-ocean-100">
                    <Droplets size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Filtrasi 7 Tahap</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                    Air melalui 7 tahap penyaringan mikro dan makro untuk menghilangkan partikel berbahaya, memastikan kemurnian 99.9%.
                </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-10 bg-gradient-to-b from-ocean-800 to-ocean-900 rounded-3xl shadow-2xl shadow-ocean-900/30 transform md:-translate-y-8 border border-ocean-700 text-white">
                <div className="w-16 h-16 bg-gold-500/20 text-gold-400 rounded-2xl flex items-center justify-center mb-8 border border-gold-500/30">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Sterilisasi UV & Ozon</h3>
                <p className="text-ocean-100 leading-relaxed text-lg opacity-90">
                    Perlindungan ganda membunuh bakteri dan virus tanpa mengubah rasa alami air. Sangat aman untuk bayi dan lansia.
                </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-gold-100">
                    <Truck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Layanan Cepat</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                    Tim kurir kami siap mengantar pesanan ke depan pintu Anda dalam waktu singkat. Gratis ongkir untuk area terdekat.
                </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. KATALOG */}
      <section id="katalog" className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
               Katalog Produk
             </h2>
             <div className="w-24 h-1.5 bg-gradient-to-r from-ocean-500 to-gold-400 mx-auto rounded-full mb-8"></div>
             <p className="text-xl text-slate-500">
                Pilih kebutuhan air minum Anda. Tersedia layanan antar ke rumah atau jemput sendiri di depot kami dengan harga spesial.
             </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400">Belum ada produk yang ditampilkan saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((prod) => (
                <ProductCard 
                    key={prod.id} 
                    product={{ ...prod, harga: Number(prod.harga) }} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. TESTIMONI */}
      {/* Jika menggunakan client component di Home, TestimonialSection pastikan support data array */}
      <TestimonialSection initialData={reviews} />

      {/* 5. LOCATION & INFO */}
      <section id="tentang-kami" className="py-32 bg-ocean-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-ocean-900/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            <div className="w-full lg:w-1/2 space-y-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Kunjungi Depot Kami</h2>
                <p className="text-ocean-200 text-xl leading-relaxed">
                  Lihat langsung proses pengisian ulang air minum yang higienis dan transparan. Kami menjunjung tinggi kebersihan untuk kepercayaan Anda.
                </p>
              </div>
              
              <div className="space-y-6 bg-ocean-900/50 p-8 rounded-3xl border border-ocean-800 backdrop-blur-sm">
                 <InfoRow icon={<MapPin className="text-gold-400"/>} title="Alamat" text="Maur Baru, Kec. Rupit, Kab. Musi Rawas Utara, Sumatera Selatan" />
                 <div className="w-full h-px bg-ocean-800"></div>
                 <InfoRow icon={<Clock className="text-gold-400"/>} title="Jam Operasional" text="Senin - Minggu: 07.00 - 21.00 WIB" />
                 <div className="w-full h-px bg-ocean-800"></div>
                 <InfoRow icon={<Users className="text-gold-400"/>} title="Layanan Pelanggan" text="Siap melayani via WhatsApp & Telepon" />
              </div>

              <div className="pt-4">
                 <a href={waLink("Halo, saya ingin bertanya tentang layanan air minum.")} target="_blank" className="inline-flex items-center gap-3 text-gold-400 font-bold hover:text-gold-300 transition text-lg group">
                    Hubungi Kami Sekarang <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20}/>
                 </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
               <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-ocean-900/50 border-4 border-ocean-800 relative group">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.149988611509!2d102.863102!3d-2.7719429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e304b139e0c3edf%3A0xbaee141b1049ede5!2sNazarel%20Qua!5e0!3m2!1sid!2sid!4v1764495166470!5m2!1sid!2sid"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" 
                    className="filter grayscale-[50%] group-hover:grayscale-0 transition duration-1000"
                  ></iframe>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 tracking-tight">Pertanyaan Umum</h2>
          <div className="space-y-6 text-left">
            <FaqItem q="Apakah galon diantar sampai ke dalam rumah?" a="Ya, kurir kami akan membantu mengangkat galon hingga ke tempat dispenser Anda demi kenyamanan maksimal." />
            <FaqItem q="Berapa minimal pemesanan untuk diantar?" a="Tidak ada minimal untuk jarak dekat (sekitar Maur Baru). Untuk area yang lebih jauh, ketentuan dapat disesuaikan." />
            <FaqItem q="Apakah menerima pencucian galon kotor?" a="Tentu! Setiap galon isi ulang akan melalui proses penyikatan mesin 360 derajat dan sterilisasi sebelum diisi air baru." />
          </div>
        </div>
      </section>

      {/* FAB WHATSAPP */}
      <a
        href={waLink("Halo, saya mau pesan air.")}
        target="_blank"
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-2xl shadow-green-600/30 transition-all hover:scale-110 group flex items-center gap-0 hover:gap-3 overflow-hidden border border-green-400"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100">
            Chat Admin
        </span>
      </a>

    </PublicLayout>
  );
}

// --- SUB COMPONENTS ---

function InfoRow({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
    return (
        <div className="flex items-start gap-5">
            <div className="bg-ocean-800 p-4 rounded-2xl border border-ocean-700 shadow-inner">{icon}</div>
            <div>
                <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
                <p className="text-ocean-200 text-lg leading-relaxed">{text}</p>
            </div>
        </div>
    )
}

function FaqItem({ q, a }: { q: string, a: string }) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-ocean-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default group">
      <h5 className="text-xl font-bold text-slate-900 mb-3 flex items-start gap-4">
        <span className="bg-ocean-50 text-ocean-600 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 group-hover:bg-ocean-600 group-hover:text-white transition-colors">Q</span>
        {q}
      </h5>
      <p className="text-slate-600 pl-12 text-lg leading-relaxed">{a}</p>
    </motion.div>
  );
}