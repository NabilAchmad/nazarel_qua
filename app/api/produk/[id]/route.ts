import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id);
    const body = await req.json();
    const updated = await prisma.produk.update({
        where: { id },
        data: {
            nama: body.nama,
            deskripsi: body.deskripsi,
            harga: body.harga,
            gambarUrl: body.gambarUrl
        },
    });
    return NextResponse.json({ ...updated, harga: updated.harga.toNumber() });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id);
    await prisma.produk.delete({ where: { id } });
    return NextResponse.json({ success: true });
}