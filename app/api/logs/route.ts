import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { ActivityLog } from '@/lib/models/ActivityLog';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectMongo();
        const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(50);
        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Gagal memuat log' }, { status: 500 });
    }
}
