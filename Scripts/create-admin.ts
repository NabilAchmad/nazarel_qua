import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import "dotenv/config"; // Import ini untuk memastikan .env dimuat jika belum

async function main() {
    const username = process.argv[2];
    const password = process.argv[3];
    
    // Ambil DATABASE_URL dari environment variables
    const databaseUrl = process.env.DATABASE_URL;

    if (!username || !password) {
        console.error("❌ Usage: ts-node Scripts/create-admin.ts <username> <password>");
        process.exit(1);
    }

    if (!databaseUrl) {
        console.error("❌ Error: DATABASE_URL environment variable is not set.");
        process.exit(1);
    }

    try {
        // --- 1. Parsing URL Koneksi ---
        // Library mysql2 TIDAK bisa menerima URL penuh, jadi kita harus mengurainya
        const url = new URL(databaseUrl); 
        
        const connectionConfig = {
            host: url.hostname,
            user: url.username,
            password: url.password,
            database: url.pathname.substring(1), // Menghilangkan '/' di awal
            port: parseInt(url.port) || 3306,
            ssl: {
                // Diperlukan untuk koneksi aman ke Railway
                rejectUnauthorized: false
            }
        };

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // --- 2. Koneksi ke MySQL Railway ---
        console.log(`Connecting to database: ${connectionConfig.host}...`);
        const connection = await mysql.createConnection(connectionConfig);

        // --- 3. Query insert ---
        const query = `
            INSERT INTO User (username, password)
            VALUES (?, ?)
        `;

        await connection.execute(query, [username, hashedPassword]);
        await connection.end();

        console.log("✅ User berhasil dibuat di Railway!");
        console.log("👤 Username:", username);

    } catch (error) {
        console.error("❌ Error saat membuat user! Pastikan kredensial dan SSL benar.");
        console.error("❌ Detail Error:", error);
    }
}

main();


