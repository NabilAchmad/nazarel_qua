// app/page.tsx
import { prisma } from '@/lib/prisma';
import AnimatedHero from '@/components/AnimatedHero';
import PublicLayout from '@/components/PublicLayout'; // Import Layout yang baru dibuat
import { MapPin, Phone, Clock, ShieldCheck, Droplets, Truck, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.produk.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const whatsappNumber = "6281367995046";
  const waLink = (namaProduk?: string) => {
    const text = namaProduk
      ? `Halo Nazarel Qua, saya ingin memesan *${namaProduk}*.`
      : `Halo Nazarel Qua, saya ingin memesan air minum.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    // GUNAKAN PUBLIC LAYOUT DI SINI
    <PublicLayout>

      {/* Hero Section */}
      <section id="home">
        <AnimatedHero />
      </section>

      {/* Keunggulan Section */}
      <section className="py-12 bg-white relative overflow-hidden border-b border-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck size={32} className="text-blue-600" />}
              title="Higienis & Steril"
              desc="Diproses melalui filtrasi bertahap dan sterilisasi UV tingkat tinggi."
            />
            <FeatureCard
              icon={<Droplets size={32} className="text-blue-600" />}
              title="Murni & Segar"
              desc="Sumber air terpilih yang menjamin kesegaran alami setiap tetesnya."
            />
            <FeatureCard
              icon={<Truck size={32} className="text-blue-600" />}
              title="Layanan Cepat"
              desc="Pesan antar yang cepat dan ramah langsung ke depan pintu Anda."
            />
          </div>
        </div>
      </section>

      {/* Katalog Section */}
      <section id="katalog" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Katalog Produk</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">Pilihan Terbaik Keluarga</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col">
                <div className="h-64 bg-gradient-to-b from-blue-50 to-white relative flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm z-10">
                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                      <Star size={12} fill="currentColor" /> 5.0
                    </div>
                  </div>
                  {prod.gambarUrl ? (
                    <img src={prod.gambarUrl} alt={prod.nama} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                  ) : (
                    <div className="text-center">
                      <Droplets size={64} className="text-blue-200 mx-auto mb-2" />
                      <span className="text-blue-300 font-bold text-lg">Nazarel Qua</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{prod.nama}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                    {prod.deskripsi || 'Air minum murni berkualitas tinggi.'}
                  </p>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Harga</p>
                      <p className="text-2xl font-bold text-blue-600">Rp {prod.harga.toNumber().toLocaleString('id-ID')}</p>
                    </div>
                    <a href={waLink(prod.nama)} target="_blank" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-green-200 flex items-center gap-2 transform active:scale-95">
                      <span>Pesan</span> <Phone size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang Kami & Lokasi Section */}
      <section id="tentang-kami" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Tentang Kami</span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">Mengapa Nazarel Qua?</h2>
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  Depot Air Minum <strong>Nazarel Qua</strong> hadir di Maur Baru dengan komitmen menyediakan air minum yang sehat, higienis, dan segar.
                  Kami menggunakan teknologi filtrasi modern serta sterilisasi ultraviolet (UV) untuk menjamin kemurnian setiap tetes air.
                </p>
              </div>
              <div className="grid gap-6">
                <InfoItem icon={<MapPin className="text-blue-600" />} title="Lokasi Strategis" desc="Maur Baru, Kec. Rupit, Kab. Musi Rawas Utara, Sumatera Selatan 31654" />
                <InfoItem icon={<Clock className="text-blue-600" />} title="Jam Operasional" desc="Buka setiap hari: 07.00 - 21.00 WIB" />
              </div>
              <div className="pt-4">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200 hover:-translate-y-1">
                  <Phone size={24} /> Hubungi Kami di WhatsApp
                </a>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-slate-100 p-2 rounded-3xl shadow-2xl rotate-1 hover:rotate-0 transition duration-500">
                <div className="h-[450px] w-full rounded-2xl overflow-hidden relative border border-slate-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.149988611509!2d102.863102!3d-2.7719429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e304b139e0c3edf%3A0xbaee141b1049ede5!2sNazarel%20Qua!5e0!3m2!1sid!2sid!4v1764495166470!5m2!1sid!2sid"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy"
                    className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition duration-700"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}

// Komponen Kecil Helper UI
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-start gap-4 hover:shadow-md transition">
      <div className="bg-white p-3 rounded-lg shadow-sm">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-800 text-lg">{title}</h4>
        <p className="text-slate-500 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}

function InfoItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="bg-white p-3 rounded-full shadow-sm shrink-0">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}