import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const pendapatan = await prisma.pendapatan.findMany({ orderBy: { tanggal: 'desc' } });
    const pengeluaran = await prisma.pengeluaran.findMany({ orderBy: { tanggal: 'desc' } });

    const totalPendapatan = pendapatan.reduce((acc, curr) => acc + curr.jumlah.toNumber(), 0);
    const totalPengeluaran = pengeluaran.reduce((acc, curr) => acc + curr.jumlah.toNumber(), 0);
    const labaBersih = totalPendapatan - totalPengeluaran;

    const history = [
        ...pendapatan.map(p => ({ ...p, type: 'PENDAPATAN', jumlah: p.jumlah.toNumber() })),
        ...pengeluaran.map(p => ({ ...p, type: 'PENGELUARAN', jumlah: p.jumlah.toNumber() }))
    ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).slice(0, 5);

    return NextResponse.json({
        totalPendapatan,
        totalPengeluaran,
        labaBersih,
        history
    });
}