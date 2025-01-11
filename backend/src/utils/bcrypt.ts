// Mengimpor pustaka bcrypt
// - `bcrypt` adalah pustaka yang digunakan untuk mengenkripsi dan memverifikasi password secara aman.
// - `bcrypt.hash()` digunakan untuk mengenkripsi password, sementara `bcrypt.compare()` digunakan untuk membandingkan password yang dimasukkan dengan hash yang sudah disimpan.

// Fungsi `hashPassword`
// - Digunakan untuk mengenkripsi password sebelum disimpan di database.
// - Parameter:
//   - `password: string`: Password yang akan dienkripsi.
// - Menggunakan `bcrypt.hash()` untuk mengenkripsi password:
//   - `password`: Password yang akan dienkripsi.
//   - `saltRounds`: Jumlah putaran (rounds) untuk menghasilkan "salt". Semakin tinggi angkanya, semakin kuat enkripsi, namun juga mempengaruhi kinerja (default: 10).
// - Mengembalikan hasil enkripsi password sebagai string.

// Fungsi `comparePassword`
// - Digunakan untuk membandingkan password yang dimasukkan dengan hash password yang disimpan di database.
// - Parameter:
//   - `password: string`: Password yang dimasukkan oleh pengguna untuk verifikasi.
//   - `hash: string`: Hash password yang disimpan di database.
// - Menggunakan `bcrypt.compare()` untuk memverifikasi kecocokan antara password dan hash:
//   - `password`: Password yang dimasukkan oleh pengguna.
//   - `hash`: Hash password yang disimpan di database.
// - Mengembalikan `true` jika password cocok dengan hash, atau `false` jika tidak cocok.
// Catatan:
// - Jangan menyimpan password dalam bentuk teks biasa (plain text). Selalu simpan password yang telah dienkripsi.
// - Pastikan untuk menggunakan algoritma hash yang kuat (seperti bcrypt) untuk menjaga keamanan data pengguna.

import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
