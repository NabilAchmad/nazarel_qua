'use client';
export default function AnimatedHero() {
    return (
        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-400 h-96 flex flex-col items-center justify-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 opacity-20 animate-pulse"></div>
            {/* Simple CSS Bubbles Animation */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-bounce delay-100"></div>
            <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full animate-ping"></div>

            <h1 className="text-5xl font-bold z-10 drop-shadow-md mb-4 text-center">
                Segar, Murni, Nazarel Qua
            </h1>
            <p className="text-xl z-10 max-w-2xl text-center">
                Air minum berkualitas tinggi untuk kesehatan keluarga Anda. Diproses dengan teknologi terkini.
            </p>
        </div>
    );
}