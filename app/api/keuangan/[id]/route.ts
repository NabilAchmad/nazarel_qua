import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'PENDAPATAN' or 'PENGELUARAN'

    if (type === 'PENDAPATAN') {
        await prisma.pendapatan.delete({ where: { id } });
    } else if (type === 'PENGELUARAN') {
        await prisma.pengeluaran.delete({ where: { id } });
    } else {
        return NextResponse.json({ error: 'Invalid Type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}