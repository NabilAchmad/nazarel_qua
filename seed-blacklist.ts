import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const badWords = [
    'anjing', 'babi', 'bangsat', 'memek', 'peler', 
    'ngentot', 'asu', 'bajingan', 'goblok', 'tolol', 
    'lonte', 'pelacur', 'pantek', 'sialan', 'jablay', 
    'dancok', 'jancok', 'dancuk', 'puki', 'kampret', 
    'kunyuk', 'tai', 'jembut', 'titit', 'bego', 
    'pekok', 'setan', 'iblis', 'keparat', 'brengsek',
    'bgsd', 'njing', 'ajg', 'meki'
];

async function main() {
    console.log('Mulai menambahkan daftar kata kasar (blacklist)...');
    
    for (const word of badWords) {
        try {
            await prisma.blacklistWord.upsert({
                where: { word },
                update: {},
                create: { word }
            });
            console.log(`+ Ditambahkan: ${word}`);
        } catch (error) {
            console.error(`- Gagal menambahkan: ${word}`);
        }
    }

    console.log('✅ Semua kata kasar berhasil dimasukkan ke database!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
