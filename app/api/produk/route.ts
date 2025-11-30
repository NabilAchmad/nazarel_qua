import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
    nama: z.string().min(1),
    deskripsi: z.string().optional(),
    harga: z.number().positive(),
    gambarUrl: z.string().optional(),
});

export async function GET() {
    const products = await prisma.produk.findMany({ orderBy: { createdAt: 'desc' } });
    // Convert Decimal to Number for JSON serialization
    const serialized = products.map(p => ({
        ...p,
        harga: p.harga.toNumber(),
    }));
    return NextResponse.json(serialized);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = productSchema.parse(body);
        const product = await prisma.produk.create({ data });
        return NextResponse.json({ ...product, harga: product.harga.toNumber() });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid Data' }, { status: 400 });
    }
}