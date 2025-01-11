// Import library React dan hooks `useState` serta `useEffect`
import React, { useState, useEffect } from "react";
// biasanya digunakan untuk berkomunikasi dengan server backend atau API. Axios mempermudah proses fetching data (GET), mengirim data (POST), memperbarui data (PUT/PATCH), atau menghapus data (DELETE) dari dan ke server.
import axioInstance from "../axiosInstance";
// Import ikon `FaShoppingBag` dan `FaListUl` dari pustaka `react-icons`
// Ikon ini akan digunakan untuk elemen UI, seperti tombol atau label
import { FaShoppingBag, FaListUl } from "react-icons/fa";
// Import komponen `NavbarBelanja` untuk menampilkan navigasi utama di halaman belanja
import NavbarBelanja from "../components/NavbarBelanja";

const Belanja = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [errorMessages, setErrorMessages] = useState({}); // Menambahkan state untuk pesan error

  const fetchCategories = async () => {
    try {
      // Melakukan permintaan GET ke endpoint "/category" menggunakan instance Axios yang telah dikonfigurasi
      const response = await axioInstance.get("/category");

      // Menyimpan data kategori yang diterima dari respons ke dalam state `categories`
      setCategories(response.data);
    } catch (error) {
      // Menampilkan pesan kesalahan jika terjadi error saat fetching data
      alert("Error fetching categories: " + error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      // Melakukan permintaan GET ke endpoint "/products" menggunakan instance Axios yang telah dikonfigurasi
      const response = await axioInstance.get("/products");

      // Menyimpan data produk yang diterima dari respons ke dalam state `products`
      setProducts(response.data);

      // Menyimpan data produk yang sama ke dalam state `filteredProducts`
      // Ini mungkin digunakan untuk pemfilteran produk berdasarkan kriteria tertentu
      setFilteredProducts(response.data);
    } catch (error) {
      // Menampilkan pesan kesalahan jika terjadi error saat fetching data produk
      alert("Error fetching products: " + error.message);
    }
  };

  const handleCategoryClick = (categoryId) => {
    // Mengubah state `selectedCategory` dengan ID kategori yang dipilih
    setSelectedCategory(categoryId);

    // Jika kategori yang dipilih adalah null (semua kategori), tampilkan semua produk
    if (categoryId === null) {
      setFilteredProducts(products); // Menampilkan semua produk
    } else {
      // Jika kategori dipilih, filter produk berdasarkan `categoryId`
      const filtered = products.filter(
        (product) => product.categoryId === categoryId
      );
      // Mengupdate state `filteredProducts` dengan produk yang sesuai kategori
      setFilteredProducts(filtered);
    }
  };

  const formatRupiah = (angka) => {
    // Menggunakan objek Intl.NumberFormat untuk memformat angka sebagai mata uang IDR (Rupiah Indonesia)
    return new Intl.NumberFormat("id-ID", {
      style: "currency", // Menentukan format sebagai mata uang
      currency: "IDR", // Menentukan mata uang yang digunakan adalah IDR (Rupiah Indonesia)
    }).format(angka); // Memformat angka yang diberikan ke format Rupiah
  };

  const handleQuantityChange = (productId, event) => {
    // Mengambil nilai quantity baru dari input event
    const newQuantity = event.target.value;

    // Mencari produk berdasarkan ID produk yang diberikan
    const product = products.find((p) => p.id === productId);

    // Memeriksa apakah quantity yang dimasukkan melebihi stok yang tersedia
    if (newQuantity > product.stokBarang) {
      // Menampilkan pesan error jika quantity melebihi stok
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [productId]: "Maaf, stok terbatas", // Menyimpan pesan error di state
      }));
    } else {
      // Menghapus pesan error jika quantity valid
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [productId]: "", // Clear error message if valid
      }));
    }

    // Mengupdate state `quantities` untuk menyimpan quantity baru
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity, // Menyimpan quantity untuk produk tertentu
    }));
  };

  const handleAddToCart = async (productId) => {
    // Fungsi ini digunakan untuk memverifikasi apakah pengguna sudah terautentikasi sebelum melakukan pembelian.
    // Pertama, mencoba untuk mendapatkan `userId` dan `token` dari localStorage.
    // Jika salah satu dari keduanya tidak ada, maka pengguna belum terautentikasi, dan akan ditampilkan pesan peringatan untuk login.
    // Jika pengguna tidak terautentikasi, maka eksekusi fungsi dibatalkan dengan `return`.
    try {
      const userId = localStorage.getItem("userId");
      const isAuthenticated = userId && localStorage.getItem("token");

      if (!isAuthenticated) {
        alert("Anda perlu login untuk melakukan pembelian.");
        return;
      }

      const quantity = quantities[productId] || 1; // Ambil quantity dari state, jika kosong default ke 1

      // Kirim data ke API untuk menambahkan produk ke keranjang
      const response = await axioInstance.post(
        "http://localhost:3000/api/checkout",
        {
          userId: Number(userId), // pastikan userId dalam bentuk number
          productId, // pastikan productId sudah benar
          quantity, // kirim quantity yang dipilih oleh user
        }
      );

      // Cek apakah response berhasil
      if (response.status === 200) {
        alert("Produk berhasil ditambahkan ke keranjang!");
      } else {
        alert("Gagal menambahkan produk ke keranjang. Coba lagi.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(
          "Gagal menambahkan produk ke keranjang: " +
            error.response.data.message
        );
      } else {
        alert("Gagal menambahkan produk ke keranjang: " + error.message);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarBelanja />
      {/* Banner Diskon */}
      <div className="mt-20 relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-10 px-6 shadow-lg overflow-hidden mb-4">
        <div className="carousel w-full rounded-lg overflow-hidden">
          {/* Slide 1 */}
          <div className="carousel-item relative w-full flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left md:w-1/2 space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Cashback <span className="block">Hingga 20%!</span>
              </h1>
              <p className="text-md md:text-lg">
                Dapatkan cashback setiap pembelian produk tertentu. Promo
                terbatas!
              </p>
            </div>
            <img
              src="/src/assets/items/bn1.png"
              alt="Cashback Promo"
              className="mt-8 md:mt-0 md:w-1/2 object-contain"
            />
          </div>
          {/* Slide 2 */}
          <div className="carousel-item relative w-full flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left md:w-1/2 space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Diskon Besar <span className="block">Produk Terbatas!</span>
              </h1>
              <p className="text-md md:text-lg">
                Jangan lewatkan diskon hingga 50% untuk produk pilihan.
              </p>
            </div>
            <img
              src="/src/assets/items/bn2.png"
              alt="Big Discount Promo"
              className="mt-8 md:mt-0 md:w-1/2 object-contain"
            />
          </div>
        </div>
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button className="w-3 h-3 rounded-full bg-white hover:bg-gray-300 transition-all"></button>
          <button className="w-3 h-3 rounded-full bg-white hover:bg-gray-300 transition-all"></button>
        </div>
      </div>

      {/* Menu Kategori Horizontal */}
      <div className="bg-white text-gray-800 py-5 px-6 shadow-md">
        <h1 className="flex text-2xl p-2 font-semibold font-serif mb-1">
          Kategori
        </h1>
        <div className="flex items-center overflow-x-auto space-x-6">
          <button
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
              selectedCategory === null ? "bg-black/10" : ""
            } hover:bg-black hover:bg-opacity-20 transition-all`}
            onClick={() => handleCategoryClick(null)}
          >
            <FaListUl className="text-lg" />
            <span className="font-semibold">All</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                selectedCategory === category.id ? "bg-black/10" : ""
              } hover:bg-black hover:bg-opacity-20 transition-all`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="text-lg" />
              <span className="font-semibold">{category.nama}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Produk */}
      <main className="p-6 container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Daftar Produk
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={`http://localhost:3000/public/images/${product.picUrl}`}
                alt={product.namaBarang}
                className="w-48 h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {product.namaBarang}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  Stok: {product.stokBarang}
                </p>
                <p className="text-lg text-orange-600 font-semibold">
                  {formatRupiah(product.hargaBarang)}
                </p>

                {/* Input untuk quantity */}
                <div className="flex items-center space-x-4 mt-4">
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1} // Menampilkan quantity yang dipilih
                    onChange={(e) => handleQuantityChange(product.id, e)}
                    className="w-16 p-1 border border-gray-300 rounded-md"
                  />
                  {errorMessages[product.id] && (
                    <p className="text-red-500 text-sm">
                      {errorMessages[product.id]}
                    </p>
                  )}
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full flex items-center justify-center bg-slate-200/0 text-black/65 py-2 px-4 rounded-lg hover:bg-slate-200/80 transition-all"
                    disabled={errorMessages[product.id]} // Disable button if error exists
                  >
                    <FaShoppingBag className="mr-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Belanja;
