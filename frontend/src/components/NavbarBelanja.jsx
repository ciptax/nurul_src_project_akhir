import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaShoppingCart, FaHome, FaUserCircle } from "react-icons/fa";
import Modal from "./Modal";
import axiosInstance from "../axiosInstance";

const NavbarBelanja = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [checkouts, setCheckouts] = useState([]);
  const dispatch = useDispatch();

  // State auth dari Redux untuk mendapatkan user_id dan status autentikasi
  const isAuthenticated = localStorage.getItem("userId");
  // const { isAuthenticated } = useSelector((state) => state.auth);

  // Fungsi Logout
  const logout = () => dispatch({ type: "LOGOUT" });

  // Fetch checkout data from API
  const fetchCheckouts = async () => {
    try {
      const response = await axiosInstance.get("/checkout");
      setCheckouts(response.data);
    } catch (error) {
      alert("Error fetching checkout: " + error.message);
    }
  };

  // Update quantity in checkouts
  const handleQuantityChange = (checkoutId, newQuantity) => {
    setCheckouts((prevCheckouts) =>
      prevCheckouts.map((checkout) => {
        if (checkout.id === checkoutId) {
          const validQuantity = Math.max(
            1,
            Math.min(newQuantity, checkout.product.stokBarang)
          );
          return { ...checkout, quantity: validQuantity };
        }
        return checkout;
      })
    );
  };

  // Delete product from checkout
  const handleRemoveFromCart = async (checkoutId) => {
    try {
      await axiosInstance.delete(`/checkout/${checkoutId}`);
      alert("Produk berhasil dihapus dari keranjang!");
      fetchCheckouts(); // Refresh checkout list
    } catch (error) {
      alert("Gagal menghapus produk dari keranjang: " + error.message);
    }
  };

  // Handle checkout
  // Handle checkout
  const handleCheckout = async () => {
    const userId = isAuthenticated;

    if (!isAuthenticated) {
      alert("Anda harus login terlebih dahulu.");
      return;
    }

    // Siapkan data cartItems dari checkouts
    const cartItems = checkouts.map((checkout) => ({
      productId: checkout.product.id,
      quantity: checkout.quantity,
      price: checkout.product.hargaBarang,
      name: checkout.product.namaBarang,
    }));

    try {
      // Melakukan request untuk checkout
      const response = await axiosInstance.post("/checkout", {
        userId,
        cartItems, // Kirimkan data cartItems
      });

      if (response.status === 200) {
        alert("Checkout berhasil!");
        window.location.href = "/order-confirmation";
      } else {
        alert(`Gagal melakukan checkout: ${response.data.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat melakukan checkout. Coba lagi nanti.");
      console.error(error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  return (
    <>
      <nav className="bg-white/45 backdrop-blur-lg text-white py-2 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 text-xl font-bold cursor-pointer">
            <span className="hover:text-sky-300 transition-all w-full">
              <strong className="text-orange-500 font-bold hover:text-orange-900 text-xl">
                Nurul SRC
              </strong>
            </span>
          </div>

          {/* Logout Button */}
          <div className="flex space-x-6 items-center">
            <div>
              <Link
                to="/"
                className="text-gray-800 text-2xl hover:text-gray-900 font-medium"
              >
                <FaHome />
              </Link>
            </div>
            {/* Cart Icon */}
            <div
              className="relative cursor-pointer hover:text-gray-900 transition-all"
              onClick={() => document.getElementById("cartModal").showModal()}
            >
              <FaShoppingCart className="text-2xl text-gray-800" />
              <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {checkouts.length}
              </span>
            </div>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <FaUserCircle className="w-6 h-6 text-gray-800" />
              </label>
              <ul
                tabIndex={0}
                className="text-black mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-10"
              >
                <li>
                  <a onClick={logout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Keranjang */}
      <Modal id="cartModal" title="Keranjang">
        {checkouts.length > 0 ? (
          <div className="space-y-6 px-6 py-4 max-h-[80vh] overflow-y-auto">
            {checkouts.map((checkout, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white py-4 px-5 rounded-xl border border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={`http://localhost:3000/public/images/${checkout.product.picUrl}`}
                  alt={checkout.product.namaBarang}
                  className="h-16 w-16 object-cover rounded-lg shadow-sm"
                />
                <div className="ml-4 flex-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {checkout.product.namaBarang}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatRupiah(checkout.product.hargaBarang)}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <label
                      htmlFor={`quantity-${index}`}
                      className="text-sm text-gray-600"
                    >
                      Jumlah Barang:
                    </label>
                    <p
                      id={`quantity-${index}`}
                      className="w-16 p-1 text-gray-700 font-medium rounded-lg"
                    >
                      {checkout.quantity}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveFromCart(checkout.id)}
                  className="text-red-500 hover:text-red-700 font-semibold transition-all duration-300"
                >
                  Hapus
                </button>
              </div>
            ))}
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="w-full bg-green-500 text-white py-2 rounded-xl shadow-md hover:bg-green-600 transition-all duration-300"
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Keranjang kosong.</p>
        )}
      </Modal>
    </>
  );
};

// Format harga ke Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka);
};

export default NavbarBelanja;
