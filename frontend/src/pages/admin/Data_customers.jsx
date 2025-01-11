import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";

// 1. Menggunakan `useState` untuk mengelola state lokal:
//    - `customers`: Digunakan untuk menyimpan data pelanggan yang diambil dari API atau sumber data lainnya.
//    - `searchTerm`: Digunakan untuk menyimpan kata kunci pencarian yang dimasukkan pengguna untuk mencari pelanggan tertentu.
const DataCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. `fetchCustomers`: Fungsi untuk mengambil data pelanggan dari API menggunakan `fetch`.
  //    - Menggunakan `await` untuk menangani response dari API secara asinkron.
  //    - Memeriksa status response dengan `response.ok`. Jika gagal, error akan dilempar.
  //    - Data yang berhasil diambil kemudian disimpan dalam state `customers` dengan `setCustomers`.
  // 2. `useEffect`: Hook React untuk menjalankan fungsi `fetchCustomers` saat komponen pertama kali dirender.
  //    - Dengan array dependensi kosong `[]`, fungsi ini hanya dipanggil sekali, mirip dengan `componentDidMount` pada class component.
  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/customers");
      if (!response.ok) {
        throw new Error("Gagal mengambil data customers");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 1. `filteredCustomers`: Variabel yang menyimpan hasil penyaringan daftar pelanggan (`customers`).
  //    - `filter` digunakan untuk memeriksa setiap `customer` apakah nama pelanggan (`customer.nama`) mengandung kata kunci pencarian (`searchTerm`).
  //    - `toLowerCase()` digunakan untuk memastikan pencarian tidak sensitif terhadap kapitalisasi huruf.
  //    - Jika nama pelanggan mengandung kata kunci pencarian, maka pelanggan tersebut akan dimasukkan dalam array `filteredCustomers`.
  const filteredCustomers = customers.filter((customer) =>
    customer.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 overflow-x-auto fixed lg:relative h-[32rem] transform">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Customers</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari customer..."
            className="input input-bordered lg:w-64 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="table w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td className="flex items-center gap-2">
                  <AiOutlineUser className="text-gray-500" />
                  {customer.nama}
                </td>
                <td>{customer.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center text-gray-500">
                Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataCustomers;
