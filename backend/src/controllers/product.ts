// Mengimpor tipe `Context` dari Hono
// - `Context` adalah tipe objek yang menyediakan informasi tentang permintaan (request) dan respons (response) dalam aplikasi Hono.
// - Ini juga menyediakan utilitas untuk menangani data, parameter, dan lainnya dalam konteks rute atau middleware.
// Mengimpor objek `prisma`
// - `prisma` adalah instance dari Prisma Client yang digunakan untuk berinteraksi dengan database.
// - Prisma memberikan cara yang kuat dan tipe-safety untuk query database menggunakan model yang didefinisikan dalam schema Prisma.
// - Dalam contoh ini, `prisma.js` mungkin berisi konfigurasi dan pengaturan untuk Prisma Client, termasuk koneksi ke database.
// Mengimpor pustaka `fs`
// - `fs` adalah modul bawaan Node.js untuk berinteraksi dengan sistem file (file system).
// - Digunakan untuk membaca, menulis, menghapus file, dan operasi lainnya pada file di sistem file server.
// - Dalam konteks ini, pustaka ini kemungkinan digunakan untuk menangani file upload atau mengakses file secara langsung dari disk.
// Mengimpor pustaka `path`
// - `path` adalah modul bawaan Node.js yang menyediakan utilitas untuk menangani dan mengubah path file atau direktori.
// - Modul ini digunakan untuk memastikan bahwa path file ditangani dengan benar, terlepas dari sistem operasi yang digunakan (misalnya, Windows vs Linux).
// - Contohnya, bisa digunakan untuk menggabungkan atau memanipulasi path file untuk mengakses file statis atau file upload.
// Mengimpor pustaka `crypto`
// - `crypto` adalah modul bawaan Node.js yang menyediakan berbagai fungsi enkripsi dan hashing.
// - Digunakan untuk membuat hash atau menghasilkan nilai acak yang aman secara cryptographic.
// - Dalam contoh ini, pustaka ini kemungkinan digunakan untuk membuat nilai hash atau token aman, seperti untuk mengenkripsi file atau menghasilkan ID unik.
import type { Context } from "hono";
import prisma from "../prisma.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Mendefinisikan kelas `ProductController`
// - Kelas ini bertanggung jawab untuk menangani permintaan terkait produk, seperti mengambil daftar produk atau operasi lain yang terkait dengan produk.

// Fungsi `index`
// - Fungsi ini digunakan untuk menangani permintaan yang mengambil semua produk yang ada di database.
// - `async` menunjukkan bahwa fungsi ini bersifat asinkron, yang berarti fungsi ini menggunakan operasi yang mungkin membutuhkan waktu, seperti mengambil data dari database.

// Mengambil produk dari database menggunakan Prisma
// - `await prisma.product.findMany()` digunakan untuk mengambil daftar produk dari database.
// - `prisma.product` merujuk pada model produk yang didefinisikan dalam Prisma schema.
// - `findMany()` adalah metode yang digunakan untuk mengambil banyak entri dari tabel produk.

// Menggunakan `include` untuk mengambil relasi terkait kategori
// - `include: { category: { select: { nama: true } } }` memungkinkan kita untuk menyertakan informasi kategori terkait setiap produk.
// - Dengan konfigurasi ini, untuk setiap produk, hanya kolom `nama` dari kategori yang akan diambil. Hal ini berguna jika kita ingin menampilkan nama kategori tanpa mengambil data kategori lengkap.

// Mengembalikan respons JSON
// - `return c.json(products)` mengembalikan respons dalam format JSON yang berisi daftar produk yang diambil dari database.
// - `products` adalah array yang berisi objek produk beserta informasi kategori terkait.

// Catatan:
// - Fungsi ini dapat digunakan sebagai bagian dari API untuk menampilkan daftar produk ke frontend.
// - Pastikan untuk menangani error dengan baik jika terjadi masalah dalam mengambil data dari database (misalnya menggunakan try-catch block untuk menangani exception).

class ProductController {
  async index(c: Context) {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            nama: true,
          },
        },
      },
    });
    return c.json(products);
  }

  // Fungsi `store` untuk menangani permintaan POST untuk menyimpan data produk baru
  // - Fungsi ini bertanggung jawab untuk memvalidasi input dari pengguna, memproses file yang diunggah (gambar produk), dan menyimpan data produk ke dalam database.
  // - Fungsi ini asinkron karena melibatkan operasi I/O seperti membaca file dan menyimpan data ke database.

  // Parsing body permintaan
  // - `const body = await c.req.parseBody();` digunakan untuk mengurai body dari permintaan yang diterima, yang mungkin berisi data JSON atau form-data.
  // - `body["namaBarang"]` adalah salah satu nilai yang diambil dari body permintaan. Ini digunakan untuk memverifikasi bahwa data sudah diparse dengan benar.

  // Validasi input
  // - `if (!body || !body["image"])` memeriksa apakah body permintaan dan field `image` ada. Jika tidak, mengembalikan error dengan status 400 (Bad Request).
  // - `const { namaBarang, hargaBarang, stokBarang, categoryId, hargaAwal } = body;` mengekstrak field yang diperlukan dari body.
  // - Jika ada field yang tidak terisi, akan mengembalikan error dengan status 400.

  // Memeriksa keberadaan fields seperti namaBarang, hargaBarang, dll. Jika tidak ada, mengembalikan error 400.

  // Menentukan lokasi penyimpanan file gambar
  // - `const uploadDir = path.join(process.cwd(), "public/images");` mendefinisikan lokasi folder untuk menyimpan gambar produk.
  // - `fs.existsSync(uploadDir)` memeriksa apakah folder untuk menyimpan gambar sudah ada, jika belum, `fs.mkdirSync` membuat folder tersebut.

  // Menangani pengunggahan file gambar
  // - `const randomFileName = crypto.randomBytes(16).toString("hex");` menghasilkan nama file acak dengan panjang 32 karakter hex untuk menghindari bentrokan nama file.
  // - `const fileExtension = path.extname(image.name);` mengambil ekstensi file gambar yang diunggah (misalnya `.jpg`, `.png`).
  // - `const newFileName = \`\${randomFileName}\${fileExtension}\`;` menggabungkan nama acak dengan ekstensi untuk membentuk nama file baru yang unik.
  // - `const filePath = path.join(uploadDir, newFileName);` mendefinisikan path lengkap tempat file akan disimpan.

  // Membaca file dan menyimpannya ke disk
  // - `const fileBuffer = Buffer.from(await image.arrayBuffer());` membaca file gambar sebagai buffer.
  // - `fs.writeFileSync(filePath, fileBuffer);` menyimpan buffer gambar ke disk pada path yang sudah ditentukan.

  // Menyimpan data produk ke dalam database
  // - `await prisma.product.create(...)` digunakan untuk membuat data produk baru di database.
  // - Menyertakan informasi seperti `namaBarang`, `hargaBarang`, `stokBarang`, `categoryId`, dan `picUrl` (URL file gambar yang telah diunggah).

  // Respons sukses
  // - Jika semua berjalan lancar, mengembalikan respons sukses dengan status 200: `Product successfully inserted`.
  // - Jika ada error dalam proses (misalnya kesalahan dalam membaca file atau menyimpan ke database), akan menangani error tersebut dan mengembalikan status 500 dengan pesan error.

  // Penanganan error
  // - `catch (error)` digunakan untuk menangkap dan menangani error yang terjadi selama proses.
  // - Jika terjadi error, mengembalikan respons JSON dengan status 500 dan pesan error.
  async store(c: Context) {
    try {
      const body = await c.req.parseBody();

      // Log hasil parsing untuk debugging
      console.log("Parsed Body:", body["namaBarang"]);

      // Validasi apakah fields dan files tersedia
      if (!body || !body["image"]) {
        return c.json(
          { message: "All fields must be filled, including image" },
          400
        );
      }

      const { namaBarang, hargaBarang, stokBarang, categoryId, hargaAwal } =
        body;
      const image = body["image"];

      // Validasi fields
      if (!namaBarang || !hargaBarang || !stokBarang || !categoryId) {
        return c.json({ message: "All fields must be filled" }, 400);
      }

      // Tentukan lokasi penyimpanan file
      const uploadDir = path.join(process.cwd(), "public/images");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Buat folder jika belum ada
      }

      // Generate random file name
      const randomFileName = crypto.randomBytes(16).toString("hex"); // 32 karakter hex
      const fileExtension = path.extname(image.name); // Ambil ekstensi file asli
      const newFileName = `${randomFileName}${fileExtension}`; // Gabungkan nama random dengan ekstensi

      const filePath = path.join(uploadDir, newFileName);

      // Baca isi file dan ubah menjadi buffer
      const fileBuffer = Buffer.from(await image.arrayBuffer());

      // Simpan file ke disk
      fs.writeFileSync(filePath, fileBuffer);

      console.log(`File uploaded to: ${filePath}`);

      // Simpan data ke database (gunakan Prisma atau ORM lainnya)
      await prisma.product.create({
        data: {
          namaBarang,
          hargaBarang: parseFloat(hargaBarang),
          stokBarang: parseInt(stokBarang, 10),
          categoryId: parseInt(categoryId, 10),
          picUrl: newFileName, // URL gambar untuk diakses
          hargaAwal: parseInt(hargaAwal, 10),
        },
      });

      // Return respons sukses
      return c.json({ message: "Product successfully inserted" }, 200);
    } catch (error) {
      console.error("Error:", error);
      return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
  }

  // Fungsi `show` untuk menangani permintaan GET yang menampilkan informasi produk berdasarkan ID
  // - Fungsi ini digunakan untuk mengambil data produk dari database berdasarkan parameter ID yang diberikan dalam URL.

  // Parsing body permintaan
  // - `const body = await c.req.parseBody();` digunakan untuk mengurai body permintaan jika ada.
  // - Meskipun tidak digunakan langsung dalam kode ini, body parsing dapat digunakan jika diperlukan untuk pengolahan lebih lanjut.

  // Mengambil ID dari parameter URL
  // - `const id = Number(c.req.param("id"));` mengambil nilai parameter `id` dari URL (misalnya, `/products/:id`).
  // - `c.req.param("id")` adalah cara Hono untuk mengakses parameter URL.
  // - `Number()` digunakan untuk mengonversi nilai ID menjadi angka, karena parameter URL biasanya berupa string.

  // Mengambil data produk berdasarkan ID
  // - `const product = await prisma.product.findUnique({ where: { id } });` digunakan untuk mencari produk dengan ID yang sesuai di database menggunakan Prisma.
  // - `prisma.product.findUnique()` adalah metode Prisma yang digunakan untuk mencari satu entri berdasarkan kondisi tertentu (dalam hal ini, ID).
  // - `where: { id }` memberikan kondisi pencarian berdasarkan ID yang diambil sebelumnya.

  // Mengembalikan respons JSON dengan data produk
  // - `return c.json(product);` mengembalikan hasil pencarian produk dalam format JSON.
  // - Jika produk ditemukan, respons JSON berisi data produk tersebut. Jika tidak ditemukan, respons JSON akan berisi `null` (produk tidak ada).

  // Penanganan error
  // - `catch (error)` digunakan untuk menangkap dan menangani error yang terjadi selama proses.
  // - Jika ada error dalam pencarian produk atau proses lainnya, error tersebut akan dilempar kembali (throw error) untuk ditangani di middleware atau tempat lain dalam aplikasi.

  async show(c: Context) {
    try {
      const body = await c.req.parseBody();
      const id = Number(c.req.param("id"));
      const product = await prisma.product.findUnique({ where: { id } });
      return c.json(product);
    } catch (error) {
      throw error;
    }
  }

  // Fungsi `update` untuk menangani permintaan PUT yang memperbarui data produk berdasarkan ID
  // - Fungsi ini digunakan untuk memperbarui data produk yang sudah ada di database, termasuk informasi seperti nama, harga, stok, kategori, dan gambar.
  // - Fungsi ini juga menangani pengunggahan gambar baru, jika ada.

  // Mengambil ID dari parameter URL
  // - `const id = Number(c.req.param("id"));` mengambil nilai parameter `id` dari URL (misalnya, `/products/:id`).
  // - `Number()` digunakan untuk mengonversi ID dari string ke angka.

  // Parsing body permintaan
  // - `const body = await c.req.parseBody();` digunakan untuk mengurai body permintaan yang berisi data produk baru atau pembaruan produk.
  // - Ini akan berisi nilai-nilai seperti `namaBarang`, `hargaBarang`, dan lain-lain yang diperlukan untuk memperbarui produk.

  // Memeriksa dan mengekstrak nilai dari body
  // - `const { namaBarang, hargaBarang, stokBarang, categoryId, hargaAwal } = body;` mengekstrak informasi produk dari body.
  // - `const image = body["image"];` memeriksa apakah ada gambar baru yang diunggah. Jika ada, gambar akan diproses, jika tidak, gambar lama tetap digunakan.

  // Validasi input
  // - `if (!namaBarang || !hargaBarang || !stokBarang || !categoryId)` memastikan bahwa semua field yang dibutuhkan sudah terisi.
  // - Jika ada field yang kosong, mengembalikan respons dengan status 400 dan pesan error.

  // Menangani gambar baru (jika ada)
  // - Jika ada file gambar baru (`if (image)`), proses berikut dilakukan:
  //     - Menentukan direktori penyimpanan gambar di server.
  //     - Memastikan direktori tersebut ada, dan jika tidak, membuatnya.
  //     - Menghasilkan nama file acak menggunakan `crypto.randomBytes(16).toString("hex")` untuk menghindari bentrokan nama file.
  //     - Mengambil ekstensi file gambar dan menggabungkannya dengan nama acak.
  //     - Membaca gambar yang diunggah sebagai buffer dan menyimpannya ke disk menggunakan `fs.writeFileSync()`.

  // Mengambil data produk yang sudah ada di database
  // - `const existingProduct = await prisma.product.findUnique({ where: { id: id } });` mengambil data produk yang sudah ada di database berdasarkan ID.
  // - Jika produk tidak ditemukan, mengembalikan respons 404 (Not Found) dengan pesan "Product not found".

  // Memperbarui data produk di database
  // - `await prisma.product.update()` digunakan untuk memperbarui data produk di database.
  // - `where: { id: id }` mencari produk berdasarkan ID.
  // - `data` berisi data yang akan diperbarui, termasuk:
  //     - `namaBarang`, `hargaBarang`, `stokBarang`, `categoryId`, `hargaAwal`
  //     - `picUrl: newFileName || existingProduct.picUrl` akan memperbarui URL gambar dengan nama file gambar baru jika ada. Jika tidak ada gambar baru, URL gambar lama tetap digunakan.

  // Mengembalikan respons sukses
  // - Jika pembaruan berhasil, mengembalikan respons JSON dengan status 200 dan pesan "Product successfully updated".

  // Penanganan error
  // - `catch (error)` menangkap dan menangani error yang terjadi selama proses update, baik itu masalah dengan pengunggahan file atau kesalahan database.
  // - Jika terjadi error, mengembalikan respons JSON dengan status 500 dan pesan error yang relevan.
  async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.parseBody();

      // Log hasil parsing untuk debugging
      console.log("Parsed Body:", body["namaBarang"]);

      const { namaBarang, hargaBarang, stokBarang, categoryId, hargaAwal } =
        body;
      const image = body["image"]; // Bisa undefined jika tidak ada gambar baru

      // Validasi fields
      if (!namaBarang || !hargaBarang || !stokBarang || !categoryId) {
        return c.json({ message: "All fields must be filled" }, 400);
      }

      let newFileName: string | undefined;

      if (image) {
        // Jika ada file gambar baru
        const uploadDir = path.join(process.cwd(), "public/images");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true }); // Buat folder jika belum ada
        }

        // Generate random file name
        const randomFileName = crypto.randomBytes(16).toString("hex"); // 32 karakter hex
        const fileExtension = path.extname(image.name); // Ambil ekstensi file asli
        newFileName = `${randomFileName}${fileExtension}`; // Gabungkan nama random dengan ekstensi

        const filePath = path.join(uploadDir, newFileName);

        // Baca isi file dan ubah menjadi buffer
        const fileBuffer = Buffer.from(await image.arrayBuffer());

        // Simpan file ke disk
        fs.writeFileSync(filePath, fileBuffer);

        console.log(`File uploaded to: ${filePath}`);
      }

      // Ambil data produk lama untuk menjaga URL gambar jika gambar baru tidak diunggah
      const existingProduct = await prisma.product.findUnique({
        where: { id: id },
      });

      if (!existingProduct) {
        return c.json({ message: "Product not found" }, 404);
      }

      // Simpan data ke database
      await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          namaBarang,
          hargaBarang: parseFloat(hargaBarang),
          stokBarang: parseInt(stokBarang, 10),
          categoryId: parseInt(categoryId, 10),
          hargaAwal: parseInt(hargaAwal, 10),
          picUrl: newFileName || existingProduct.picUrl, // Gunakan gambar baru jika ada, jika tidak gunakan gambar lama
        },
      });

      // Return respons sukses
      return c.json({ message: "Product successfully updated" }, 200);
    } catch (error) {
      console.error("Error:", error);
      return c.json({ error: error?.message || "Internal Server Error" }, 500);
    }
  }

  // Fungsi `destroy` untuk menangani permintaan DELETE yang menghapus data produk berdasarkan ID
  // - Fungsi ini digunakan untuk menghapus produk yang ada di database berdasarkan parameter ID yang diberikan dalam URL.

  // Mengambil ID dari parameter URL
  // - `const id = Number(c.req.param("id"));` mengambil nilai parameter `id` dari URL (misalnya, `/products/:id`).
  // - `Number()` digunakan untuk mengonversi ID dari string ke angka.

  // Menghapus produk dari database
  // - `await prisma.product.delete({ where: { id } });` digunakan untuk menghapus produk yang memiliki ID sesuai dengan yang diterima.
  // - `prisma.product.delete()` adalah metode Prisma yang digunakan untuk menghapus entri dari database berdasarkan ID yang diberikan.
  // - `where: { id }` menentukan ID produk yang akan dihapus.

  // Mengembalikan respons sukses
  // - Jika produk berhasil dihapus, mengembalikan respons JSON dengan status 200 dan pesan "Product deleted successfully".

  // Penanganan error
  // - `catch (error)` digunakan untuk menangkap dan menangani error yang terjadi selama proses penghapusan.
  // - Jika ada error (misalnya produk tidak ditemukan atau masalah lainnya), error tersebut akan dicetak di console (`console.error`) dan mengembalikan respons JSON dengan status 500 dan pesan error yang relevan.
  async destroy(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await prisma.product.delete({ where: { id } });
      return c.json({ message: "Product deleted successfully" }, 200);
    } catch (error) {
      console.error("Error deleting product:", error);
      return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
  }
}

export default new ProductController();
