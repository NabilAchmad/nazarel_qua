// app/api/testimoni/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validasi Input
const testimoniSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    pekerjaan: z.string().optional(),
    rating: z.number().min(1).max(5),
    komentar: z.string().min(5, "Komentar minimal 5 karakter"),
});

export async function GET() {
    try {
        // Ambil 6 testimoni terbaru
        const data = await prisma.testimoni.findMany({
            orderBy: { createdAt: 'desc' },
            take: 6
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = testimoniSchema.parse(body);

        const result = await prisma.testimoni.create({
            data: validatedData
        });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }
}