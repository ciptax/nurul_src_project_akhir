// Titik masuk utama untuk aplikasi React
// 1. Mengimpor pustaka dan modul yang diperlukan untuk aplikasi
//    - `StrictMode`: Komponen bawaan React untuk membantu mendeteksi potensi masalah di aplikasi Anda selama pengembangan.
//    - `createRoot`: Fungsi dari React DOM untuk membuat akar (root) aplikasi React.
//    - `createBrowserRouter` dan `RouterProvider`: Digunakan untuk konfigurasi dan pengelolaan routing di aplikasi menggunakan React Router.
//    - `store` dan `Provider`: Digunakan untuk mengatur state global aplikasi menggunakan Redux.
// 2. Mengimpor komponen halaman
//    - `Home`, `About`, `Contact`, `Belanja`, `Login`: Komponen halaman utama untuk aplikasi frontend.
//    - `Dashboard`, `Barang`, `Data_customers`, `Kategori`, `Ulasan`, `Laporan_keuangan`, `Laporan_penjualan`: Komponen halaman admin untuk mengelola bagian backend.
//    - `Register`, `Transaction`, `TransactionHistory`: Komponen halaman tambahan untuk fitur lainnya.
// 3. Mengimpor `PrivateRoute`
//    - Komponen khusus untuk membatasi akses halaman berdasarkan status autentikasi pengguna.
// 4. Mengimpor file CSS utama
//    - `index.css`: Digunakan untuk mendefinisikan gaya global aplikasi.
// 5. Membangun konfigurasi rute menggunakan `createBrowserRouter`
//    - Menentukan hubungan antara URL dan komponen yang akan dirender untuk setiap jalur.
// 6. Mengatur `Provider` Redux
//    - Membungkus aplikasi dengan `StoreProvider` agar semua komponen dalam aplikasi dapat mengakses state global melalui Redux.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Belanja from "./pages/Belanja";
import Login from "./pages/Login";
import "./index.css";
import { store } from "./store";
import { Provider as StoreProvider } from "react-redux";
import Dashboard from "./pages/admin/dashboard";
import Barang from "./pages/admin/Barang";
import Data_customers from "./pages/admin/Data_customers";
import Kategori from "./pages/admin/Kategori";
import Ulasan from "./pages/admin/Ulasan";
import Laporan_keuangan from "./pages/admin/Laporan_keuangan";
import Laporan_penjualan from "./pages/admin/Laporan_penjualan";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Transaction from "./pages/Transaction";
import TransactionHistory from "./pages/TransactionHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "belanja", // Halaman Belanja untuk user biasa
        element: (
          <PrivateRoute>
            <Belanja />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "Transaction", // Halaman transaksi untuk user customers
    element: (
      <PrivateRoute>
        <Transaction />
      </PrivateRoute>
    ),
  },
  {
    path: "TransactionHistory", // Halaman riwayat transaksi untuk user customers
    element: (
      <PrivateRoute>
        <TransactionHistory />
      </PrivateRoute>
    ),
  },
  {
    path: "/login", // Halaman login untuk user berdasarkan rolenya
    element: <Login />,
  },
  {
    path: "/register", // Halaman register untuk user berdasarkan role masing masing
    element: <Register />,
  },
  {
    // - Digunakan untuk halaman admin dengan URL "/admin".
    // - Elemen yang dirender adalah komponen `Dashboard`, tetapi dibungkus oleh `PrivateRoute`.
    // - `PrivateRoute` adalah komponen pelindung (guard) yang memeriksa apakah pengguna sudah login atau memiliki izin akses sebelum menampilkan `Dashboard`.
    // - Jika pengguna tidak memenuhi syarat (misalnya, belum login atau bukan admin), `PrivateRoute` akan mengarahkan pengguna ke halaman login atau halaman lain yang sesuai.
    path: "/admin",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/admin/barang", // Halaman data barang untuk user admin
        element: <Barang />,
      },
      {
        path: "/admin/Data_customers", // Halaman data customers untuk user admin
        element: <Data_customers />,
      },
      {
        path: "/admin/kategori", // Halaman kategori untuk user admin
        element: <Kategori />,
      },
      {
        path: "/admin/ulasan", // Halaman ulasan untuk user admin
        element: <Ulasan />,
      },
      {
        path: "/admin/laporan_keuangan", // Halaman laporan keuangan untuk user admin
        element: <Laporan_keuangan />,
      },
      {
        path: "/admin/laporan_penjualan", // Halaman penjualan untuk user admin
        element: <Laporan_penjualan />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreProvider store={store}>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>
);
