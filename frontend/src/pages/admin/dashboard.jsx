// 1. Mengimpor beberapa icon dari library `react-icons` yang digunakan untuk memperindah tampilan antarmuka pengguna (UI) dengan berbagai simbol, seperti:
//    - `AiOutlineMenu`, `AiOutlineHome`, `AiOutlineDatabase`, `AiOutlineAppstore`, `AiOutlineUnorderedList`, `AiOutlineUsergroupAdd`: Ikon dari `react-icons/ai` yang digunakan untuk navigasi dan menu.
//    - `HiArrowCircleDown`, `HiArrowCircleLeft`: Ikon dari `react-icons/hi` yang menunjukkan arah panah, digunakan untuk aksi navigasi atau interaksi lainnya.
//    - `FaUserAlt`, `FaUserAstronaut`, `FaDollarSign`, `FaFileAlt`: Ikon dari `react-icons/fa` untuk berbagai fitur terkait pengguna, keuangan, dan dokumen.
//    - `MdAssessment`: Ikon dari `react-icons/md` untuk fitur laporan atau evaluasi.
// 2. Mengimpor komponen dari `react-router-dom` untuk menangani routing dalam aplikasi:
//    - `Outlet`: Komponen untuk tempat rendering rute anak di dalam layout.
//    - `useLocation`: Hook untuk mendapatkan informasi tentang lokasi (URL) saat ini.
//    - `NavLink`: Komponen untuk membuat navigasi yang dapat aktif secara otomatis ketika berada pada rute yang sesuai.
// 3. Mengimpor `useDispatch` dari `react-redux` yang digunakan untuk mengirimkan aksi ke Redux store, memungkinkan pengelolaan state global aplikasi.

import React, { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineDatabase,
  AiOutlineAppstore,
  AiOutlineUnorderedList,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { HiArrowCircleDown, HiArrowCircleLeft } from "react-icons/hi";
import {
  FaUserAlt,
  FaUserAstronaut,
  FaDollarSign,
  FaFileAlt,
} from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { useDispatch } from "react-redux";

// 1. Menggunakan `useState` untuk mengelola state lokal:
//    - `isSidebarOpen`: Menentukan apakah sidebar sedang terbuka atau tidak.
//    - `isKelolaDataOpen`: Menentukan apakah dropdown untuk bagian "Kelola Data" terbuka atau tidak.
//    - `islaporanOpen`: Menentukan apakah dropdown untuk bagian "Laporan" terbuka atau tidak.
// 2. Menggunakan `useLocation` dari `react-router-dom` untuk mendapatkan informasi tentang lokasi saat ini (URL), yang digunakan untuk menandai rute yang aktif.
// 3. Menggunakan `useDispatch` dari `react-redux` untuk mendispatch aksi ke Redux store, seperti saat pengguna logout. Fungsi `logout` akan mengirimkan aksi dengan tipe `LOGOUT` ke Redux store untuk mengubah status otentikasi pengguna (misalnya menghapus token dan data pengguna).
// 4. Fungsi `toggleSidebar` digunakan untuk membalikkan nilai `isSidebarOpen` setiap kali sidebar perlu dibuka atau ditutup.
// 5. Fungsi `toggleKelolaDataDropdown` digunakan untuk membalikkan nilai `isKelolaDataOpen` ketika pengguna mengklik dropdown "Kelola Data".
// 6. Fungsi `togglelaporanDropdown` digunakan untuk membalikkan nilai `islaporanOpen` ketika pengguna mengklik dropdown "Laporan".
// 7. Variabel `isDashboard` digunakan untuk memeriksa apakah halaman saat ini adalah halaman dashboard dengan membandingkan `location.pathname` dengan string rute yang diinginkan.
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isKelolaDataOpen, setIsKelolaDataOpen] = useState(false);
  const [islaporanOpen, setIslaporanOpen] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleKelolaDataDropdown = () => {
    setIsKelolaDataOpen(!isKelolaDataOpen);
  };

  const togglelaporanDropdown = () => {
    setIslaporanOpen(!islaporanOpen);
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  const isDashboard =
    location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className="flex bg-gray-50 relative">
      {/* Overlay for closing sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-20 bg-gradient-to-r from-gray-800 to-gray-900
      text-white h-screen transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
      >
        <div className="p-5 text-x font-bold flex items-center justify-between">
          <span>Nurul SRC</span>
        </div>

        <ul className="menu p-4">
          <li className="mb-2">
            <NavLink
              to="/admin"
              className="flex items-center gap-2 hover:bg-black hover:bg-opacity-20"
            >
              <AiOutlineHome className="w-5 h-5 text-white" />
              <span className="text-white">Dashboard</span>
            </NavLink>
          </li>

          {/* Kelola Data Dropdown */}
          <li className="relative">
            <button
              className="flex items-center gap-2 w-full text-left hover:bg-black hover:bg-opacity-20"
              onClick={toggleKelolaDataDropdown}
            >
              <AiOutlineDatabase className="w-5 h-5 text-white" />
              <span className="text-white">Kelola Data</span>
              <span className="ml-auto text-white">
                {isKelolaDataOpen ? (
                  <HiArrowCircleDown className="w-5 h-6" />
                ) : (
                  <HiArrowCircleLeft className="w-5 h-6" />
                )}
              </span>
            </button>
            {isKelolaDataOpen && (
              <ul className="menu pl-6 mt-2">
                <li>
                  <NavLink
                    to="/admin/barang"
                    className="flex items-center gap-2 hover:bg-black hover:bg-opacity-20"
                  >
                    <AiOutlineAppstore className="w-5 h-5 text-white" />
                    <span className="text-white">Barang</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/data_customers"
                    className="flex items-center gap-2 hover:bg-black hover:bg-opacity-20"
                  >
                    <AiOutlineUsergroupAdd className="w-5 h-5 text-white" />
                    <span className="text-white">Customers</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/kategori"
                    className="flex items-center gap-2 hover:bg-black hover:bg-opacity-20"
                  >
                    <AiOutlineUnorderedList className="w-5 h-5 text-white" />
                    <span className="text-white">Kategori</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li className="relative">
            <button
              className="flex items-center gap-2 w-full text-lef hover:bg-black hover:bg-opacity-20"
              onClick={togglelaporanDropdown}
            >
              <FaFileAlt className="text-lg text-white" />
              <span className="text-white">Laporan</span>
              <span className="ml-auto text-white">
                {islaporanOpen ? (
                  <HiArrowCircleDown className="w-5 h-6" />
                ) : (
                  <HiArrowCircleLeft className="w-5 h-6" />
                )}
              </span>
            </button>
            {islaporanOpen && (
              <ul className="menu pl-6 mt-2">
                <li>
                  <NavLink
                    to="/admin/laporan_keuangan"
                    className="flex items-center gap-2 hover:bg-black hover:bg-opacity-20"
                  >
                    <MdAssessment className="text-white" />
                    <span className="text-white">Keuangan</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/laporan_penjualan"
                    className="flex items-center gap-2 hover:bg-black hover:bg-opacity-20"
                  >
                    <MdAssessment className="text-white" />
                    <span className="text-white">Penjualan</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Navbar */}
        <div className="w-full bg-white shadow-lg p-2 flex justify-between items-center">
          <button className="btn lg:hidden" onClick={toggleSidebar}>
            <AiOutlineMenu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold px-6">Admin Dashboard</h1>
          {/* Profil Admin */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <FaUserAstronaut className="w-6 h-6" />
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-10"
            >
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Konten Dashboard */}
        <div className="p-6">
          {isDashboard ? (
            <>
              <h2 className="text-3xl font-semibold px-3 mb-11 p-1 rounded-md">
                Dashboard
              </h2>
              <div className="px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="relative card bg-black bg-opacity-5 shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                  {/* Icon di atas card dengan efek overlay */}
                  <div className="border absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-white bg-opacity-40 p-4 rounded-full shadow-md">
                    <FaUserAlt className="text-3xl" />
                  </div>
                  <div className="card-body text-center">
                    <h2 className="card-title font-bold">Jumlah Customers</h2>
                    <p className="text-sm font-bold">Berapa</p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="relative card  bg-black bg-opacity-5  shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                  {/* Icon di atas card dengan efek overlay */}
                  <div className="border absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-white bg-opacity-40 p-4 rounded-full shadow-md">
                    <MdAssessment className="text-3xl " />
                  </div>
                  <div className="card-body text-center">
                    <h2 className="card-title font-bold">Penjualan</h2>
                    <p className="text-sm font-bold">Total</p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="relative card bg-black bg-opacity-5 text-accent-content shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                  {/* Icon di atas card dengan efek overlay */}
                  <div className="border absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-white bg-opacity-40 p-4 rounded-full shadow-md">
                    <FaDollarSign className="text-3xl" />
                  </div>
                  <div className="card-body text-center">
                    <h2 className="card-title font-bold">Keuangan</h2>
                    <p className="text-sm font-bold ">Total</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
