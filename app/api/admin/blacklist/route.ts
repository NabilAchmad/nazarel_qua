// app/api/admin/blacklist/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logActivity } from '@/lib/logger';

// Skema Validasi
const schema = z.object({
    word: z.string().min(2, "Kata minimal 2 karakter").toLowerCase(),
});

export async function GET() {
    const words = await prisma.blacklistWord.findMany({ orderBy: { word: 'asc' } });
    return NextResponse.json(words);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { word } = schema.parse(body);

        const newWord = await prisma.blacklistWord.create({
            data: { word }
        });

        await logActivity(
            'Tambah Filter Kata',
            { word, deskripsi: `Menambahkan kata '${word}' ke dalam daftar kata terlarang.` }
        );

        return NextResponse.json(newWord);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal menambah kata / Kata sudah ada' }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = Number(searchParams.get('id'));

        const wordRecord = await prisma.blacklistWord.findUnique({ where: { id } });
        if (wordRecord) {
            await prisma.blacklistWord.delete({ where: { id } });
            await logActivity(
                'Hapus Filter Kata',
                { word: wordRecord.word, deskripsi: `Menghapus kata '${wordRecord.word}' dari daftar kata terlarang.` }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 });
    }
}