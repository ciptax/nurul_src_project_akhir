// Mengimpor modul yang diperlukan untuk membangun server backend menggunakan Hono
// 1. `serve`:
//    - Fungsi dari `@hono/node-server` untuk menjalankan server Node.js berbasis Hono.
// 2. `serveStatic`:
//    - Middleware dari `@hono/node-server/serve-static` untuk melayani file statis, seperti gambar, CSS, atau file JavaScript.
// 3. `Hono`:
//    - Framework web ringan untuk membangun aplikasi API atau server dengan performa tinggi dan sintaks yang sederhana.
// 4. `cors`:
//    - Middleware dari Hono untuk mengatur kebijakan Cross-Origin Resource Sharing (CORS), memungkinkan akses API dari domain lain.

// Mengimpor handler dan middleware khusus
// 1. `loginHandler` dan `registerHandler`:
//    - Fungsi handler untuk menangani permintaan login dan registrasi pengguna, masing-masing diimpor dari folder `auth`.
// 2. `authMiddleware`:
//    - Middleware untuk memeriksa autentikasi pengguna sebelum mereka dapat mengakses endpoint tertentu.
//    - Contohnya, melindungi rute seperti checkout atau data pengguna agar hanya dapat diakses oleh pengguna yang sudah login.

// Mengimpor controller
// 1. `ProductController`:
//    - Controller untuk menangani operasi terkait produk, seperti membuat, membaca, memperbarui, dan menghapus data produk.
// 2. `CategoryController`:
//    - Controller untuk menangani operasi kategori produk.
// 3. `customers`:
//    - Controller untuk menangani data pelanggan.
// 4. `CheckoutController`:
//    - Controller untuk menangani proses checkout, seperti mengelola keranjang belanja atau membuat pesanan baru.
// 5. `contactHandler` dan `getContactsHandler`:
//    - Handler untuk menangani data kontak, seperti menyimpan pesan dari pengguna atau mengambil daftar pesan.

// Catatan: Kode ini merupakan bagian dari pengaturan server backend menggunakan Hono, dengan struktur modular untuk mengatur berbagai fitur dan endpoint API secara terorganisir.

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { loginHandler } from "./auth/login.js";
import { registerHandler } from "./auth/register.js";
import { authMiddleware } from "./auth/authMiddleware.js";
import ProductController from "./controllers/product.js";
import CategoryController from "./controllers/category.js";
import customers from "./controllers/customers.js";
import CheckoutController from "./controllers/checkout.js";
import { contactHandler, getContactsHandler } from "./controllers/contact.js";

// Membuat instance aplikasi Hono
// - `app`: Objek utama dari Hono untuk mendefinisikan rute, middleware, dan konfigurasi server.

// Menambahkan middleware CORS ke rute dengan prefix "/api/*"
// - Middleware CORS (Cross-Origin Resource Sharing) digunakan untuk mengatur kebijakan akses lintas domain.
// - Dengan konfigurasi ini, setiap permintaan yang cocok dengan rute `/api/*` akan mematuhi aturan CORS berikut:

// Konfigurasi CORS:
// 1. `origin`:
//    - Mengatur daftar domain yang diizinkan mengakses API ini.
//    - Dalam contoh ini, hanya permintaan dari `http://localhost:5173` (misalnya frontend lokal) yang diizinkan.
// 2. `allowHeaders`:
//    - Daftar header tambahan yang diizinkan dikirim oleh klien dalam permintaan mereka.
//    - Contoh: `Content-Type`, `Authorization`, dan `X-Requested-With`.
// 3. `allowMethods`:
//    - Metode HTTP yang diizinkan untuk digunakan dalam permintaan API ini.
//    - Contoh: `GET`, `POST`, `PUT`, `PATCH`, dan `DELETE`.
// 4. `exposeHeaders`:
//    - Header tertentu yang diizinkan untuk diakses oleh klien dalam respons dari server.
//    - Contoh: `Content-Type` dan `Authorization`.
// 5. `maxAge`:
//    - Waktu (dalam detik) yang menunjukkan seberapa lama browser dapat menyimpan cache aturan CORS ini.
//    - Dalam contoh ini, cache disimpan selama 600 detik (10 menit).
// 6. `credentials`:
//    - Mengaktifkan pengiriman kredensial seperti cookie, token autentikasi, atau informasi sesi dalam permintaan lintas domain.

// Dengan middleware ini, aplikasi Hono akan mengizinkan permintaan lintas domain sesuai dengan aturan yang telah ditentukan.

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    exposeHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
    credentials: true,
  })
);

// Route untuk Public
app.use("/public/*", serveStatic({ root: "./" }));

// app.basePath("/api");

// Mendefinisikan rute HTTP GET pada path "/"
// - `app.get("/", ...)` digunakan untuk menangani permintaan GET ke URL root ("/") dari server.

// Callback untuk menangani permintaan
// - `(c) => { ... }` adalah fungsi handler untuk permintaan GET.
// - `c` adalah objek konteks (context) dari Hono yang menyediakan akses ke permintaan, respons, dan utilitas lainnya.

// Respons JSON
// - `c.json({ ... })` digunakan untuk mengembalikan respons dalam format JSON.
// - Respons berisi sebuah objek dengan properti `message` yang nilainya adalah `process.env.JWT_SECRET!`.

// Penjelasan `process.env.JWT_SECRET!`:
// - `process.env.JWT_SECRET`: Variabel lingkungan (environment variable) yang biasanya digunakan untuk menyimpan data sensitif, seperti secret key untuk JWT (JSON Web Token).
// - Tanda `!` (non-null assertion) memastikan TypeScript bahwa nilai `JWT_SECRET` tidak null atau undefined.
// - Pastikan variabel `JWT_SECRET` sudah disetel dalam file `.env` atau lingkungan sistem sebelum menjalankan server.
// - Contoh nilai `JWT_SECRET`: "mySuperSecretKey123".

// Catatan:
// - Rute ini dapat digunakan untuk debugging atau memastikan bahwa variabel lingkungan `JWT_SECRET` tersedia di server.
// - Jangan gunakan respons seperti ini di lingkungan produksi karena dapat membocorkan data sensitif.
app.get("/", (c) => {
  return c.json({ message: process.env.JWT_SECRET! });
});
//users route
app.post("/api/register", registerHandler);
app.post("/api/login", loginHandler);
app.get("/api/customers", customers.index);
app.get("/api/customers/:id", customers.show);
app.post("/api/customers", customers.store);
app.put("/api/customers/:id", customers.update);
app.patch("/api/customers/:id", customers.update);
app.delete("/api/customers/:id", customers.destroy);

// Product Route
app.get("/api/products", ProductController.index);
app.get("/api/products/:id", ProductController.show);
app.post("/api/products", ProductController.store);
app.put("/api/products/:id", ProductController.update);
app.patch("/api/products/:id", ProductController.update);
app.delete("/api/products/:id", ProductController.destroy);

// Category Route
app.get("/api/category", CategoryController.index);
app.get("/api/category/:id", CategoryController.show);
app.post("/api/category", CategoryController.store);
app.put("/api/category/:id", CategoryController.update);
app.patch("/api/category/:id", CategoryController.update);
app.delete("/api/category/:id", CategoryController.destroy);

// Checkout Route
app.get("/api/checkout", CheckoutController.index);
app.get("/api/checkout/:id", CheckoutController.show);
app.post("/api/checkout", CheckoutController.store);
app.put("/api/checkout/:id", CheckoutController.update);
app.patch("/api/checkout/:id", CheckoutController.update);
app.delete("/api/checkout/:id", CheckoutController.destroy);

// contact
app.post("/api/contact", contactHandler);
app.get("/api/contacts", getContactsHandler);

// Mendefinisikan rute HTTP GET pada path "/protected"
// - `app.get("/protected", ...)` digunakan untuk menangani permintaan GET ke rute "/protected".

// Middleware `authMiddleware`
// - Middleware kedua pada rute ini adalah `authMiddleware`.
// - Fungsi ini bertugas memeriksa autentikasi pengguna sebelum handler utama dijalankan.
// - Biasanya, middleware ini memverifikasi token (seperti JWT) atau kredensial lainnya untuk memastikan pengguna memiliki akses yang sah.
// - Jika autentikasi gagal, middleware ini akan menghentikan proses dan mengembalikan respons seperti status 401 (Unauthorized).
// - Jika autentikasi berhasil, kontrol dilanjutkan ke handler berikutnya.

// Callback untuk menangani permintaan yang lolos autentikasi
// - `(c) => { ... }` adalah fungsi handler utama yang dijalankan setelah `authMiddleware`.
// - `c.json({ message: "Protected route" })` mengembalikan respons dalam format JSON, yang berisi pesan bahwa pengguna telah mengakses rute yang dilindungi.

// Contoh alur:
// 1. Pengguna mengirim permintaan GET ke "/protected".
// 2. `authMiddleware` memverifikasi apakah pengguna memiliki izin akses.
//    - Jika valid, permintaan diteruskan ke handler `(c) => { ... }`.
//    - Jika tidak valid, pengguna menerima respons error (misalnya 401 Unauthorized).
// 3. Jika autentikasi berhasil, server merespons dengan JSON: `{ message: "Protected route" }`.

// Catatan:
// - Rute ini biasanya digunakan untuk API yang hanya dapat diakses oleh pengguna yang terautentikasi, seperti dashboard atau data pribadi.
app.get("/protected", authMiddleware, (c) => {
  return c.json({ message: "Protected route" });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
