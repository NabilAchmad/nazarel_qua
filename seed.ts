import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Menambahkan akun admin default...');
    
    // Hash password 'admin123'
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Upsert (Buat jika belum ada, abaikan jika sudah ada)
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {}, // Jangan ubah apa-apa jika sudah ada
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    });

    console.log('✅ Akun Admin berhasil dibuat!');
    console.log('Username : admin');
    console.log('Password : admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
