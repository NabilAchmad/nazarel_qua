// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No files received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ganti spasi dengan dash agar aman di URL
        const filename = Date.now() + '_' + file.name.replaceAll(" ", "_");

        // Pastikan folder public/uploads ada
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await mkdir(uploadDir, { recursive: true });

        // Simpan file
        await writeFile(path.join(uploadDir, filename), buffer);

        // Return URL public
        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.log("Error uploading file: ", error);
        return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
    }
}