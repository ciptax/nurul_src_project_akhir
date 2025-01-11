import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

const LaporanKeuangan = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get("/transaction");
      const filteredData = applyFilters(response.data);
      setTransactions(filteredData);
      calculateTotalRevenue(filteredData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories"); // Contoh API untuk kategori
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = (data) => {
    return data.filter((transaction) => {
      const matchesStartDate =
        filters.startDate === "" ||
        new Date(transaction.tanggal) >= new Date(filters.startDate);
      const matchesEndDate =
        filters.endDate === "" ||
        new Date(transaction.tanggal) <= new Date(filters.endDate);
      const matchesCategory =
        filters.category === "" ||
        transaction.product.categoryId === parseInt(filters.category);

      return matchesStartDate && matchesEndDate && matchesCategory;
    });
  };

  const calculateTotalRevenue = (data) => {
    const total = data.reduce((acc, transaction) => acc + transaction.total, 0);
    setTotalRevenue(total);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Laporan Penjualan</h1>

      {/* Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative">
          <h1 className="mb-2">Mulasi pada tanggal :</h1>
          <input
            type="date"
            className="input input-bordered"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"></label>
        </div>

        <div className="relative">
          <h1 className="mb-2">Sampai tanggal :</h1>
          <input
            type="date"
            className="input input-bordered"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"></label>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300">ID Penjualan</th>
              <th className="border border-gray-300">Nama Produk</th>
              <th className="border border-gray-300">Harga</th>
              <th className="border border-gray-300">Jumlah</th>
              <th className="border border-gray-300">Total</th>
              <th className="border border-gray-300">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border border-gray-300 text-center">
                    {transaction.id}
                  </td>
                  <td className="border border-gray-300 text-center">
                    {transaction.product.namaBarang}
                  </td>
                  <td className="border border-gray-300 text-center">
                    Rp {transaction.product.hargaBarang.toLocaleString("id-ID")}
                  </td>
                  <td className="border border-gray-300 text-center">
                    {transaction.jumlah}
                  </td>
                  <td className="border border-gray-300 text-center">
                    Rp {transaction.total.toLocaleString("id-ID")}
                  </td>
                  <td className="border border-gray-300 text-center">
                    {new Date(transaction.tanggal).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 border border-gray-300"
                >
                  Tidak ada data transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanKeuangan;
