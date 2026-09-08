'use client';

import { useState, useEffect } from 'react';
import { Activity, Clock, User, Info, Loader2, ArrowRight, CheckCircle2, ShieldAlert, PlusCircle, MinusCircle, Wallet, Tag, MessageSquare, Star } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface Log {
    _id: string;
    action: string;
    username?: string;
    details: any;
    createdAt: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/logs')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getActionBadge = (action: string) => {
        if (action.includes('PENDAPATAN')) return <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full border border-green-200 shadow-sm flex items-center gap-1"><PlusCircle className="w-3 h-3"/> PENDAPATAN</span>;
        if (action.includes('PENGELUARAN')) return <span className="px-3 py-1 text-xs font-bold bg-rose-100 text-rose-700 rounded-full border border-rose-200 shadow-sm flex items-center gap-1"><MinusCircle className="w-3 h-3"/> PENGELUARAN</span>;
        if (action.includes('PRODUK')) return <span className="px-3 py-1 text-xs font-bold bg-ocean-100 text-ocean-700 rounded-full border border-ocean-200 shadow-sm flex items-center gap-1"><Tag className="w-3 h-3"/> PRODUK BARU</span>;
        if (action.includes('BLACKLIST')) return <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full border border-amber-200 shadow-sm flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> KEAMANAN</span>;
        if (action.includes('TESTIMONI')) return <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full border border-blue-200 shadow-sm flex items-center gap-1"><MessageSquare className="w-3 h-3"/> TESTIMONI</span>;
        
        return <span className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full shadow-sm">{action}</span>;
    };

    const LogDetailsRenderer = ({ action, details }: { action: string, details: any }) => {
        if (action === 'CREATE_PENDAPATAN' || action === 'CREATE_PENGELUARAN') {
            const isPendapatan = action === 'CREATE_PENDAPATAN';
            return (
                <div className="mt-3 flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                    <div className={`p-3 rounded-xl ${isPendapatan ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Mencatat {isPendapatan ? 'pemasukan' : 'pengeluaran'} baru</p>
                        <p className="text-lg font-bold text-slate-800">
                            Rp {details?.jumlah?.toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            <ArrowRight className="w-3 h-3 text-slate-400" /> {details?.keterangan || '-'}
                        </p>
                    </div>
                </div>
            );
        }

        if (action === 'CREATE_PRODUK') {
            return (
                <div className="mt-3 flex items-center gap-4 bg-ocean-50/50 p-4 rounded-xl border border-ocean-100 shadow-sm">
                    <div className="p-3 bg-ocean-100 text-ocean-600 rounded-xl">
                        <Tag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-ocean-800/70 font-medium mb-1">Produk Baru Ditambahkan</p>
                        <p className="text-lg font-bold text-ocean-900">{details?.nama}</p>
                        <p className="text-xs text-ocean-800/50 mt-1">ID Produk: #{details?.produkId}</p>
                    </div>
                </div>
            );
        }

        if (action === 'ADD_BLACKLIST' || action === 'REMOVE_BLACKLIST') {
            const isAdd = action === 'ADD_BLACKLIST';
            return (
                <div className={`mt-3 flex items-center gap-4 p-4 rounded-xl border shadow-sm ${isAdd ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`p-3 rounded-xl ${isAdd ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium mb-1 text-slate-600">
                            {isAdd ? 'Menambahkan kata ke daftar sensor' : 'Menghapus kata dari sensor'}
                        </p>
                        <p className={`text-lg font-bold ${isAdd ? 'text-amber-700' : 'text-slate-700'} tracking-wide line-through decoration-2`}>
                            "{details?.word}"
                        </p>
                    </div>
                </div>
            );
        }
        
        if (action === 'TESTIMONI_BARU') {
            return (
                <div className="mt-3 flex items-start gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mt-1">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-blue-800/70 font-medium mb-1">Ulasan Pelanggan Baru</p>
                        <p className="text-lg font-bold text-slate-800">{details?.nama}</p>
                        <div className="flex items-center gap-1 text-gold-500 my-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < (details?.rating || 0) ? "currentColor" : "none"} className={i < (details?.rating || 0) ? "text-gold-500" : "text-slate-300"} />
                            ))}
                        </div>
                        <p className="text-sm text-slate-600 italic">"{details?.komentar || 'Tanpa komentar'}"</p>
                    </div>
                </div>
            );
        }

        // Fallback untuk action lain
        return (
            <div className="mt-3 bg-slate-50 rounded-xl p-4 text-sm font-mono text-slate-600 overflow-x-auto border border-slate-200 shadow-inner">
                <pre>{JSON.stringify(details, null, 2)}</pre>
            </div>
        );
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-ocean-900 to-ocean-800 p-8 rounded-3xl shadow-xl shadow-ocean-900/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gold-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Activity className="w-8 h-8 text-gold-400" />
                        Log Aktivitas 
                        <span className="bg-gold-500/20 text-gold-300 text-xs py-1 px-3 rounded-full font-semibold border border-gold-500/30">MongoDB</span>
                    </h1>
                    <p className="text-ocean-100 mt-2 text-lg opacity-90 max-w-xl">
                        Riwayat aktivitas pengguna dan perubahan sistem tercatat secara real-time.
                    </p>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-32">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Loader2 className="w-10 h-10 text-ocean-600" />
                            </motion.div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Activity className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="text-xl font-medium text-slate-600">Belum ada log aktivitas.</p>
                            <p className="text-slate-400 mt-2">Data aktivitas akan muncul di sini.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute top-8 bottom-8 left-[39px] w-[2px] bg-gradient-to-b from-ocean-200 via-slate-200 to-transparent rounded-full"></div>
                            
                            <ul className="space-y-8">
                                <AnimatePresence>
                                    {logs.map((log, index) => (
                                        <motion.li 
                                            key={log._id} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="relative flex items-start gap-8 group"
                                        >
                                            {/* Timeline Node */}
                                            <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-white border-[6px] border-slate-50 rounded-full shadow-sm group-hover:border-ocean-50 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                                                <div className="w-12 h-12 bg-gradient-to-br from-ocean-50 to-slate-100 rounded-full flex items-center justify-center text-ocean-600 shadow-inner">
                                                    <Info className="w-5 h-5" />
                                                </div>
                                            </div>
                                            
                                            {/* Log Content Card */}
                                            <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-ocean-900/5 hover:-translate-y-1 transition-all duration-300">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        {getActionBadge(log.action)}
                                                        <span className="flex items-center text-sm text-slate-600 gap-1.5 font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                                            <User className="w-4 h-4 text-ocean-500" />
                                                            {log.username || 'Sistem'}
                                                        </span>
                                                    </div>
                                                    <span className="flex items-center text-sm font-medium text-slate-400 gap-1.5 bg-slate-50/50 px-3 py-1 rounded-lg">
                                                        <Clock className="w-4 h-4 text-gold-500" />
                                                        {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                                                    </span>
                                                </div>
                                                
                                                {/* Human Readable Details */}
                                                <LogDetailsRenderer action={log.action} details={log.details} />
                                            </div>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
