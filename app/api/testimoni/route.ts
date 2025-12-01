// app/api/testimoni/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const testimoniSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    pekerjaan: z.string().optional(),
    rating: z.number().min(1).max(5),
    komentar: z.string().min(5, "Komentar minimal 5 karakter"),
});

export async function GET(req: Request) {
    try {
        // Cek apakah ada parameter ?mode=admin
        const { searchParams } = new URL(req.url);
        const isAdmin = searchParams.get('mode') === 'admin';

        const data = await prisma.testimoni.findMany({
            orderBy: { createdAt: 'desc' },
            // Jika admin, ambil semua. Jika public, ambil 6 saja.
            take: isAdmin ? undefined : 6
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    // ... (Sama seperti sebelumnya, tidak berubah)
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