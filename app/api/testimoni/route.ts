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
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('mode') === 'admin';

    const data = await prisma.testimoni.findMany({
        orderBy: { createdAt: 'desc' },
        take: isAdmin ? undefined : 6
    });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = testimoniSchema.parse(body);

        // --- CEK KATA KASAR (SENSOR) ---
        const blacklist = await prisma.blacklistWord.findMany();
        const badWords = blacklist.map(b => b.word);

        const inputKomentar = validatedData.komentar.toLowerCase();
        const inputNama = validatedData.nama.toLowerCase();

        // Cek apakah komentar mengandung kata terlarang
        const foundBadWord = badWords.find(bad => inputKomentar.includes(bad) || inputNama.includes(bad));

        if (foundBadWord) {
            return NextResponse.json(
                { error: `Ulasan Anda mengandung kata yang tidak diperbolehkan: "${foundBadWord}"` },
                { status: 400 }
            );
        }
        // -------------------------------

        const result = await prisma.testimoni.create({
            data: validatedData
        });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Data tidak valid atau mengandung kata kasar' }, { status: 400 });
    }
}