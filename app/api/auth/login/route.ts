import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password } = loginSchema.parse(body);

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });

        const token = signToken({ id: user.id, username: user.username });
        const response = NextResponse.json({ success: true });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}