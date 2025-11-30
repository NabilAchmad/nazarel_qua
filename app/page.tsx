// app/page.tsx
import { prisma } from '@/lib/prisma';
import AnimatedHero from '@/components/AnimatedHero';
import PublicNavbar from '@/components/PublicNavbar';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'; // Pastikan lucide-react terinstall

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.produk.findMany({ orderBy: { createdAt: 'desc' } });

  // Ganti nomor ini dengan nomor WA asli Depot Anda
  const whatsappNumber = "6281234567890"; 
  const waLink = `https://wa.me/${whatsappNumber}?text=Halo%20Nazarel%20Qua,%20saya%20ingin%20memesan%20air%20minum.`;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 pt-16">
      <PublicNavbar />

      {/* Hero Section */}
      <section id="home">
        <AnimatedHero />
      </section>

      {/* Katalog Section */}
      <section id="katalog" className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Produk Pilihan Kami</h2>
          <p className="text-gray-500 mt-2">Kualitas air terbaik untuk kesegaran keluarga Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 group">
              <div className="h-56 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
                 {prod.gambarUrl ? (
                   <img src={prod.gambarUrl} alt={prod.nama} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                 ) : (
                   <span className="text-blue-300 text-4xl font-bold">NQ</span>
                 )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{prod.nama}</h3>
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">{prod.deskripsi || 'Air minum murni diproses higienis.'}</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-blue-600 font-bold text-lg">Rp {prod.harga.toNumber().toLocaleString('id-ID')}</p>
                  <a href={waLink} target="_blank" className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition">
                    Pesan
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tentang Kami & Lokasi Section */}
      <section id="tentang-kami" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            
            {/* Informasi Teks */}
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-blue-900">Tentang Nazarel Qua</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Depot Air Minum Nazarel Qua berkomitmen menyediakan air minum yang sehat, higienis, dan segar untuk masyarakat. 
                Menggunakan teknologi filtrasi modern dan sterilisasi ultraviolet untuk menjamin kemurnian setiap tetes air.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Lokasi Kami</h4>
                    <p className="text-gray-600">Jl. Contoh No. 123, Kelurahan Air Bersih, Kecamatan Sejahtera.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Jam Operasional</h4>
                    <p className="text-gray-600">Senin - Sabtu: 07.00 - 20.00 WIB</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <a 
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-200 transform hover:-translate-y-1"
                >
                  <Phone size={24} />
                  Pesan via WhatsApp
                </a>
              </div>
            </div>

            {/* Maps / Visual Lokasi */}
            <div className="w-full md:w-1/2 h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
              {/* Embed Google Maps - Ganti src dengan embed map lokasi asli Anda */}
              {/* <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.0506385458!2d98.591636!3d3.595195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131cc1c3eb2fd%3A0x23d431c8a6908262!2sMedan%2C%20North%20Sumatra!5e0!3m2!1sen!2sid!4v1625050000000!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              ></iframe> */}
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.149988611509!2d102.863102!3d-2.7719429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e304b139e0c3edf%3A0xbaee141b1049ede5!2sNazarel%20Qua!5e0!3m2!1sid!2sid!4v1764495166470!5m2!1sid!2sid"
              width="600" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={ true } 
              loading="lazy" 
              className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Depot Air Minum Nazarel Qua.</p>
          <p className="text-sm mt-2">Melayani dengan Sepenuh Hati.</p>
        </div>
      </footer>
    </main>
  );
}