// React: Library utama untuk membangun antarmuka pengguna (UI).
// useState: Hook untuk mengelola state dalam komponen fungsional.
// useEffect: Hook untuk mengelola efek samping, seperti fetching data atau mengatur listener.
import React, { useState, useEffect } from "react";
// Outlet: Komponen dari react-router-dom yang digunakan sebagai placeholder untuk merender komponen anak sesuai rute saat ini.
// useLocation: Hook yang memberikan akses ke lokasi saat ini, berguna untuk mendapatkan path URL yang aktif.
import { Outlet, useLocation, Link } from "react-router-dom";
// Navbar: Komponen navigasi di bagian atas aplikasi, biasanya memuat menu atau tautan penting.
// Footer: Komponen di bagian bawah aplikasi, biasanya memuat informasi tambahan seperti hak cipta atau tautan sosial.
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Mengimpor stylesheet untuk react-responsive-carousel, library yang digunakan untuk membuat carousel (slider) responsif.
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaUserCircle } from "react-icons/fa";
// format: Fungsi dari library date-fns untuk memformat tanggal ke dalam string.
// id: Lokalisasi bahasa Indonesia untuk date-fns, memungkinkan format tanggal sesuai dengan konvensi Indonesia.
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Komponen ini adalah functional component menggunakan arrow function.
// Komponen berfungsi untuk halaman Home, yang mungkin menjadi halaman utama aplikasi.
const Home = () => {
  // products: Menyimpan daftar produk (diambil dari API).
  // setProducts: Fungsi untuk memperbarui daftar produk.
  const [products, setProducts] = useState([]);
  // filteredProducts: Menyimpan produk yang sudah difilter, misalnya berdasarkan pencarian atau kategori.
  // setFilteredProducts: Fungsi untuk memperbarui daftar produk yang telah difilter.
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [getContacts, setGetContacts] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const location = useLocation();

  const images = [
    "/src/assets/items/bn1.png",
    "/src/assets/items/bn2.png",
    "/src/assets/items/bn3.png",
  ];

  // Tujuan: Mengambil data kontak dari server menggunakan API dan menyimpannya dalam state getContacts.
  // Async/Await:
  // Fungsi ini menggunakan async/await untuk menunggu hasil dari permintaan fetch dan parsing data JSON.
  // Error Handling:
  // Jika ada kesalahan selama proses pengambilan data (seperti koneksi gagal atau endpoint tidak ditemukan), kesalahan akan ditangani dan ditampilkan di konsol.
  // State Update:
  // Data yang diterima dari API digunakan untuk memperbarui state lokal menggunakan setGetContacts.
  const fetchGetContacts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/contacts");
      const data = await response.json();
      setGetContacts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Melakukan permintaan GET ke endpoint "http://localhost:3000/api/products"
        const response = await fetch("http://localhost:3000/api/products");

        // Mengonversi respons menjadi format JSON
        const data = await response.json();

        // Menyimpan data produk ke dalam state `products`
        setProducts(data);

        // Menyimpan data produk yang sama ke dalam state `filteredProducts`
        // Ini berguna untuk menampilkan data awal sebelum dilakukan filter
        setFilteredProducts(data);

        // Menandai bahwa proses loading selesai
        setLoading(false);
      } catch (error) {
        // Menangani error jika terjadi kegagalan dalam proses fetch
        console.error("Error fetching products:", error);

        // Menghentikan status loading meskipun terjadi error
        setLoading(false);
      }
    };

    // Memanggil fungsi fetch untuk produk
    fetchProducts();

    // Memanggil fungsi fetch untuk kontak
    fetchGetContacts();
  }, []);

  useEffect(() => {
    // Membuat interval untuk mengganti indeks gambar secara otomatis setiap 2 detik
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    // Membersihkan interval saat komponen di-unmount atau `images.length` berubah
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSearch = (e) => {
    // Mengambil nilai input pencarian dan mengonversinya ke huruf kecil
    const keyword = e.target.value.toLowerCase();

    // Menyimpan kata kunci pencarian ke state `searchKeyword`
    setSearchKeyword(keyword);

    // Memfilter produk berdasarkan nama barang atau harga barang yang mengandung kata kunci
    const filtered = products.filter(
      (product) =>
        product.namaBarang.toLowerCase().includes(keyword) || // Cocokkan nama barang
        product.hargaBarang.toString().includes(keyword) // Cocokkan harga barang
    );

    // Menyimpan produk yang sudah difilter ke state `filteredProducts`
    setFilteredProducts(filtered);
  };

  // Menentukan komentar yang akan ditampilkan berdasarkan status `showAllComments`
  const commentsToShow = showAllComments
    ? getContacts // Jika `showAllComments` bernilai true, tampilkan semua kontak
    : getContacts.slice(0, 3); // Jika false, hanya tampilkan 2 komentar pertama

  return (
    // Komponen JSX untuk merender komentar yang dipilih
    <div className="relative">
      <Navbar />
      <main>
        {location.pathname === "/" && (
          <>
            {/* Hero Section */}
            <section className="mt-20 hero relative bg-gradient-to-r from-yellow-500 to-orange-500 py-10">
              <div className="max-w-6xl mx-auto px-4">
                <div
                  className="shadow-xl relative p-6 rounded-xl bg-gradient-to-r from-yellow-300 via-orange-400 to-orange-300"
                  style={{
                    backgroundClip: "border-box",
                    animation: "moving-border 5s linear infinite",
                    backgroundSize: "200% 200%",
                  }}
                >
                  <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-orange-50 rounded-lg">
                    <div className="w-full md:w-1/3">
                      <img
                        src={images[currentImageIndex]}
                        alt={`Banner ${currentImageIndex + 1}`}
                        className="rounded-lg shadow-md object-cover w-full h-auto"
                      />
                    </div>
                    <div className="w-full md:w-2/3 text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-900 to-yellow-900 bg-clip-text text-transparent">
                      <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-center md:text-left">
                        Temukan Produk Terbaik!
                      </h2>
                      <p className="text-sm md:text-lg font-bold leading-relaxed text-center md:text-left">
                        Jelajahi berbagai kategori produk dengan diskon
                        eksklusif yang hanya tersedia hari ini. Jangan lewatkan
                        penawaran menarik kami!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Search Section */}
            <section className="py-8 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-center text-2xl mb-2 font-semibold">
                  Cari Produk Anda Disini
                </h1>
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={handleSearch}
                    placeholder="Cari Produk"
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </section>
            <hr className="border-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 rounded-full my-2" />

            {/* Produk Section */}
            <section className="flash-sale py-14 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
                  Produk Kami
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {loading ? (
                    <p className="col-span-full text-center text-gray-400 animate-pulse">
                      Memuat produk...
                    </p>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                      >
                        <img
                          src={`http://localhost:3000/public/images/${product.picUrl}`}
                          alt={product.namaBarang}
                          className="w-48 h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {product.namaBarang}
                          </h3>
                          <p className="text-gray-600 font-bold mt-2">
                            Rp {product.hargaBarang.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-400">
                      Produk tidak ditemukan.
                    </p>
                  )}
                </div>
              </div>
            </section>
            <hr className="border-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 rounded-full my-2" />
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <h2 className="text-3xl font-bold text-center text-orange-700 mb-10">
                  Apa Kata Pelanggan Kami?
                </h2>
                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {commentsToShow.map((contact, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <p className="italic text-gray-700 text-base">
                        "{contact.message}"
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 text-2xl font-bold">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {contact.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {format(
                              new Date(contact.createdAt),
                              "d MMMM yyyy, HH:mm",
                              { locale: id }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Show More/Less Button */}
                {getContacts.length > 3 && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setShowAllComments(!showAllComments)}
                      className="px-8 py-3 text-white bg-orange-600 rounded-full shadow-lg hover:bg-orange-700 transition font-semibold"
                    >
                      {showAllComments
                        ? "Tampilkan Sedikit Komentar"
                        : "Tampilkan Semua Komentar"}
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Newsletter Subscription Section */}
            <section
              className="py-14 text-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill-opacity='0.05'><rect x='0' y='0' width='50' height='50' fill='%23fff'/><rect x='50' y='50' width='50' height='50' fill='%23fff'/></svg>"), linear-gradient(to right, #ff8c42, #fcb045)`,
                backgroundSize: "50px 50px, cover",
              }}
            >
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-6">
                  Berikan Ulasan Kepada Kami
                </h2>
                <p className="text-lg mb-6">
                  Pendapat Anda sangat berharga bagi kami! Bantu kami
                  meningkatkan layanan dan produk dengan memberikan ulasan Anda.
                  Suara Anda adalah inspirasi kami untuk terus menjadi lebih
                  baik.
                </p>

                <form className="flex flex-col md:flex-row gap-4 justify-center">
                  <button className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-100 transition">
                    <li>
                      <Link
                        to="/contact"
                        className="hover:text-yellow-400 transition-colors"
                      >
                        Berikan Ulasan
                      </Link>
                    </li>
                  </button>
                </form>
              </div>
            </section>
          </>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
