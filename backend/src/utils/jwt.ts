// Mengimpor pustaka yang diperlukan
// 1. `jwt`:
//    - Pustaka untuk membuat (sign) dan memverifikasi (verify) token JWT (JSON Web Token).
//    - Digunakan untuk keperluan autentikasi dan otorisasi pengguna.
// 2. `dotenv`:
//    - Pustaka untuk memuat variabel lingkungan (environment variables) dari file `.env` ke dalam `process.env`.
//    - Berguna untuk mengelola konfigurasi sensitif seperti secret key atau durasi token.

// Mengonfigurasi dotenv
// - `dotenv.config()` akan membaca file `.env` dan menambahkan variabel-variabelnya ke dalam `process.env`.

// Mendapatkan secret key dari variabel lingkungan
// - `process.env.JWT_SECRET!`: Secret key yang digunakan untuk mengenkripsi dan mendekripsi token JWT.
// - Tanda `!` memastikan TypeScript bahwa variabel ini tidak null atau undefined.
// - Pastikan `JWT_SECRET` disetel di file `.env` atau lingkungan sistem sebelum menjalankan aplikasi.

// Fungsi `generateToken`
// - Digunakan untuk membuat token JWT berdasarkan payload yang diberikan.
// - Parameter:
//   - `payload: object`: Data pengguna atau informasi lain yang akan dimasukkan ke dalam token JWT.
// - Menggunakan metode `jwt.sign()` untuk membuat token:
//   - `payload`: Objek yang akan dienkripsi ke dalam token.
//   - `secret`: Secret key yang digunakan untuk mengenkripsi token.
//   - `expiresIn`: Durasi token, diambil dari variabel lingkungan `JWT_EXPIRES_IN` (contoh: "1h" untuk 1 jam).
// - Mengembalikan token JWT dalam bentuk string.

// Fungsi `verifyToken`
// - Digunakan untuk memverifikasi token JWT yang diterima dari klien.
// - Parameter:
//   - `token: string`: Token JWT yang akan diverifikasi.
// - Menggunakan metode `jwt.verify()` untuk memeriksa keabsahan token:
//   - `token`: Token yang akan diverifikasi.
//   - `secret`: Secret key yang digunakan untuk memverifikasi token.
// - Jika token valid, fungsi ini mengembalikan data yang didekodekan dari token.
// - Jika token tidak valid, metode ini akan melemparkan error yang dapat ditangani oleh aplikasi Anda.

// Contoh Penggunaan:
// - Membuat token: `const token = generateToken({ id: 1, role: "admin" });`
// - Memverifikasi token:
//   ```javascript
//   try {
//       const decoded = verifyToken(token);
//       console.log(decoded); // Output: { id: 1, role: "admin", iat: ..., exp: ... }
//   } catch (err) {
//       console.error("Invalid token:", err);
//   }
//   ```

// Catatan:
// - Pastikan `JWT_SECRET` dan `JWT_EXPIRES_IN` diatur dengan benar dalam file `.env`.
// - Contoh isi file `.env`:
//   ```
//   JWT_SECRET=mySuperSecretKey123
//   JWT_EXPIRES_IN=1h

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET!;

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, secret);
};
