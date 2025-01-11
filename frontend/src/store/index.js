// Mengimpor fungsi `configureStore` dari Redux Toolkit
// Digunakan untuk membuat store Redux dengan konfigurasi yang lebih sederhana dan terstruktur.

// Reducer untuk autentikasi pengguna (`authReducer`)
// - Reducer ini bertugas mengelola state yang berkaitan dengan autentikasi pengguna, seperti data pengguna, status login, dan token autentikasi.
// - State awal (`initial state`) memiliki properti:
//   - `user`: Data pengguna yang null saat belum login.
//   - `isAuthenticated`: Status autentikasi awal (false).
//   - `token`: Token autentikasi awal (null).
// - `action.type` menentukan jenis aksi yang memengaruhi state:
//   1. **LOGIN**:
//      - Aksi ini dijalankan saat pengguna berhasil login.
//      - Data token, role, dan ID pengguna disimpan ke `localStorage` untuk keperluan akses di sesi berikutnya.
//      - State diubah untuk menyimpan data pengguna, status login (true), dan token autentikasi.
//   2. **LOGOUT**:
//      - Aksi ini dijalankan saat pengguna logout.
//      - Semua data di `localStorage` dihapus menggunakan `localStorage.clear()`.
//      - State diatur kembali ke nilai awal (tidak ada pengguna yang login).
//   3. **Default**:
//      - Jika tipe aksi tidak dikenal, reducer mengembalikan state yang ada tanpa perubahan.

// Membuat store Redux menggunakan `configureStore`
// - Store adalah wadah utama untuk state global aplikasi.
// - `reducer` adalah konfigurasi yang berisi daftar reducer yang digunakan di aplikasi ini.
// - Reducer `authReducer` ditambahkan dengan nama `auth`, yang berarti state autentikasi akan diakses melalui `state.auth` di seluruh aplikasi.

import { configureStore } from "@reduxjs/toolkit";

// Reducer untuk user authentication
const authReducer = (
  state = { user: null, isAuthenticated: false, token: null },
  action
) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.user.token);
      localStorage.setItem("role", action.payload.user.role);
      localStorage.setItem("userId", action.payload.user.id);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.user.token,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

// Membuat store dengan configureStore
export const store = configureStore({
  reducer: {
    auth: authReducer, // Menambahkan reducer auth ke dalam store
  },
});
