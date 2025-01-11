// Mengimpor pustaka `axios`
// - Axios digunakan untuk melakukan permintaan HTTP ke API, seperti GET, POST, PUT, DELETE.

// Membuat instance Axios (`axiosInstance`)
// - Instance ini dibuat agar konfigurasi dasar untuk setiap permintaan HTTP tidak perlu diulang.

// Konfigurasi instance:
// 1. `baseURL`:
//    - Menentukan URL dasar untuk semua permintaan HTTP menggunakan instance ini.
//    - URL ini dapat disesuaikan dengan alamat API Anda (contoh: "http://localhost:3000/api").
// 2. `headers`:
//    - Menambahkan header bawaan untuk setiap permintaan HTTP.
//    - `Content-Type: application/json`: Menginformasikan bahwa data yang dikirim dan diterima menggunakan format JSON.
// 3. `withCredentials`:
//    - Mengaktifkan pengiriman cookie bersama dengan permintaan, jika diperlukan oleh server untuk autentikasi atau sesi pengguna.
//    - Contohnya: Digunakan ketika API membutuhkan token atau cookie untuk mengidentifikasi pengguna.

// Catatan: Dengan instance ini, setiap kali Anda melakukan permintaan seperti `axiosInstance.get("/endpoint")`, konfigurasi ini akan otomatis diterapkan.

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Ganti dengan URL API Anda
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
