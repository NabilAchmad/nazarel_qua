import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const transSchema = z.object({
    type: z.enum(['PENDAPATAN', 'PENGELUARAN']),
    tanggal: z.string(), // ISO String
    jumlah: z.number().positive(),
    keterangan: z.string(),
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // Filter Tanggal
    const dateFilter: any = {};
    if (startParam && endParam) {
        dateFilter.tanggal = {
            gte: new Date(startParam),
            lte: new Date(endParam),
        };
    }

    try {
        const pendapatan = await prisma.pendapatan.findMany({
            where: dateFilter,
            orderBy: { tanggal: 'desc' }
        });
        const pengeluaran = await prisma.pengeluaran.findMany({
            where: dateFilter,
            orderBy: { tanggal: 'desc' }
        });

        const combined = [
            ...pendapatan.map(p => ({ ...p, type: 'PENDAPATAN', jumlah: p.jumlah.toNumber() })),
            ...pengeluaran.map(p => ({ ...p, type: 'PENGELUARAN', jumlah: p.jumlah.toNumber() }))
        ];

        // Sort by date desc
        combined.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

        return NextResponse.json(combined);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { type, tanggal, jumlah, keterangan } = transSchema.parse(body);

        let result;
        if (type === 'PENDAPATAN') {
            result = await prisma.pendapatan.create({
                data: { userId: session.id, tanggal: new Date(tanggal), jumlah, keterangan }
            });
        } else {
            result = await prisma.pengeluaran.create({
                data: { userId: session.id, tanggal: new Date(tanggal), jumlah, keterangan }
            });
        }
        return NextResponse.json({ ...result, jumlah: result.jumlah.toNumber(), type });
    } catch (e) {
        return NextResponse.json({ error: 'Error' }, { status: 400 });
    }
}