import React, { useState } from "react";

const Transaction = () => {
  // Data dummy untuk simulasi
  const [checkouts, setCheckouts] = useState([
    {
      id: 1,
      product: {
        namaBarang: "Produk A",
        hargaBarang: 50000,
        stokBarang: 10,
        picUrl: "produk-a.jpg",
      },
      quantity: 2,
    },
    {
      id: 2,
      product: {
        namaBarang: "Produk B",
        hargaBarang: 75000,
        stokBarang: 5,
        picUrl: "produk-b.jpg",
      },
      quantity: 1,
    },
  ]);

  const [alamat, setAlamat] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("");

  // Hapus produk dari keranjang
  const handleRemoveFromCart = (checkoutId) => {
    setCheckouts((prevCheckouts) =>
      prevCheckouts.filter((checkout) => checkout.id !== checkoutId)
    );
    alert("Produk berhasil dihapus!");
  };

  // Simulasi checkout
  const handleCheckout = () => {
    if (!alamat || !metodePembayaran) {
      alert("Harap lengkapi alamat dan metode pembayaran.");
      return;
    }

    console.log("Checkout berhasil:", checkouts);
    alert("Checkout berhasil!");
    setCheckouts([]); // Kosongkan keranjang setelah checkout
    setAlamat(""); // Kosongkan alamat
    setMetodePembayaran(""); // Kosongkan metode pembayaran
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Transaksi Pembelian
      </h1>
      {checkouts.length > 0 ? (
        <div className="space-y-6">
          {checkouts.map((checkout) => (
            <div
              key={checkout.id}
              className="flex items-center justify-between border-b pb-6 p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-white hover:shadow-xl transition-all duration-300"
            >
              <img
                src={`/assets/images/${checkout.product.picUrl}`}
                alt={checkout.product.namaBarang}
                className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300 shadow-lg"
              />
              <div className="ml-6 flex-1">
                <p className="text-xl font-semibold text-gray-800">
                  {checkout.product.namaBarang}
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  Rp {checkout.product.hargaBarang.toLocaleString("id-ID")}
                </p>
                <p className="text-md text-gray-500 mt-1">
                  Jumlah: {checkout.quantity} pcs
                </p>
              </div>
              <button
                onClick={() => handleRemoveFromCart(checkout.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              >
                Hapus
              </button>
            </div>
          ))}

          {/* Alamat Pengiriman */}
          <div className="mt-8">
            <label
              htmlFor="alamat"
              className="text-lg text-gray-700 font-semibold"
            >
              Alamat Pengiriman
            </label>
            <textarea
              id="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full p-4 border-2 rounded-lg mt-2 text-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan alamat lengkap"
              rows="4"
            />
          </div>

          {/* Metode Pembayaran */}
          <div className="mt-6">
            <label
              htmlFor="metodePembayaran"
              className="text-lg text-gray-700 font-semibold"
            >
              Metode Pembayaran
            </label>
            <select
              id="metodePembayaran"
              value={metodePembayaran}
              onChange={(e) => setMetodePembayaran(e.target.value)}
              className="w-full p-4 border-2 rounded-lg mt-2 text-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Pilih Metode Pembayaran</option>
              <option value="transfer">Transfer Bank</option>
              <option value="creditCard">Kartu Kredit</option>
              <option value="gopay">GOPAY</option>
              <option value="ovo">OVO</option>
            </select>
          </div>

          {/* Button Checkout */}
          <div className="text-center mt-8">
            <button
              className="bg-green-500 text-white py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-all"
              onClick={handleCheckout}
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">Keranjang kosong.</p>
      )}
    </div>
  );
};

export default Transaction;
