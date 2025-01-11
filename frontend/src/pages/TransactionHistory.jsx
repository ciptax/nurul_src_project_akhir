import React from "react";
import "daisyui/dist/full.css"; // Pastikan DaisyUI sudah terinstal dan diimport

const TransactionHistory = () => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen p-8">
      <div className="container mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          Riwayat Pesanan
        </h1>

        {/* Transaction Table */}
        <div className="overflow-x-auto bg-white shadow-2xl rounded-xl p-8">
          <table className="table table-zebra w-full">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
              <tr>
                <th className="text-left">Urutan</th>
                <th className="text-left">Nama Barang</th>
                <th className="text-left">Tangal Pesanan</th>
                <th className="text-left">Pembayaran</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Example Rows */}
              <tr className="hover:bg-gray-100">
                <td className="py-4">1</td>
                <td className="py-4">Beras Sovia</td>
                <td className="py-4">2024-12-14</td>
                <td className="py-4">Rp.8,000</td>
                <td className="py-4">
                  <span className="badge badge-success">Paid</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="py-4">2</td>
                <td className="py-4">Minyak Goreng</td>
                <td className="py-4">2024-12-12</td>
                <td className="py-4">Rp.15,000</td>
                <td className="py-4">
                  <span className="badge badge-warning">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Payment */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-800">
            Total Pembayaran:
          </span>
          <span className="text-xl font-bold text-gray-900">Rp.23,000</span>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center">
          <button className="btn btn-outline btn-sm mx-1">Previous</button>
          <button className="btn btn-sm mx-1">1</button>
          <button className="btn btn-outline btn-sm mx-1">Next</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
