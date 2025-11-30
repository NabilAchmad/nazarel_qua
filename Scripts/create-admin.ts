import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

async function main() {
    const username = process.argv[2];
    const password = process.argv[3];

    if (!username || !password) {
        console.error("❌ Usage: ts-node create-admin.ts <username> <password>");
        process.exit(1);
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Koneksi ke MySQL
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",        // ganti sesuai MySQL kamu
            password: "password",        // isi jika MySQL pakai password
            database: "nazarelqua", // ganti nama database
        });

        // Query insert
        const query = `
      INSERT INTO User (username, password)
      VALUES (?, ?)
    `;

        await connection.execute(query, [username, hashedPassword]);
        await connection.end();

        console.log("✅ User berhasil dibuat!");
        console.log("👤 Username:", username);
        console.log("🔐 Hashed Password:", hashedPassword);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main();
