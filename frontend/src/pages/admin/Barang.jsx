import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import axioInstance from "../../axiosInstance";

const Barang = () => {
  // Komponen Barang bertujuan untuk menampilkan dan mengelola data produk.
  // 1. `useState` digunakan untuk menyimpan data produk (`products`), kategori (`categories`), dan data produk baru (`dataProduct`).
  // 2. `products` menyimpan daftar produk yang akan ditampilkan.
  // 3. `categories` menyimpan daftar kategori produk yang tersedia.
  // 4. `dataProduct` adalah objek yang menyimpan data produk yang sedang diinput, termasuk:
  //    - `namaBarang`: Nama produk
  //    - `hargaBarang`: Harga jual produk
  //    - `stokBarang`: Stok produk yang tersedia
  //    - `categoryId`: ID kategori produk
  //    - `hargaAwal`: Harga awal produk sebelum dijual
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dataProduct, setDataProduct] = useState({
    namaBarang: "",
    hargaBarang: "",
    stokBarang: "",
    categoryId: "",
    hargaAwal: "",
  });

  // State dan fungsi tambahan untuk fitur pengelolaan produk pada komponen Barang:
  // 1. `editingProduct`: Menyimpan data produk yang sedang diedit.
  // 2. `isEditing`: Boolean untuk menentukan apakah pengguna sedang dalam mode edit.
  // 3. `imageFile`: Menyimpan file gambar yang diunggah untuk produk.
  // 4. `searchTerm`: Menyimpan kata kunci pencarian yang dimasukkan pengguna.
  // 5. `filteredProducts`: Menyimpan daftar produk yang sudah difilter berdasarkan kata kunci pencarian.
  // 6. `handleFileChange`: Fungsi yang menangani perubahan input file gambar, menyimpan file ke dalam state `imageFile`.

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
  const [filteredProducts, setFilteredProducts] = useState([]); // State untuk produk yang sudah difilter

  const hanldeFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Fungsi `handleOpenModal` digunakan untuk membuka modal untuk menambahkan produk baru:
  // 1. `setIsEditing(false)`: Mengatur mode ke "tambah" (bukan edit).
  // 2. `setEditingProduct(null)`: Menghapus data produk yang sedang diedit untuk memastikan form kosong.
  // 3. `setDataProduct`: Mereset data form produk dengan nilai default kosong.
  // 4. `setImageFile(null)`: Menghapus file gambar yang sebelumnya mungkin diunggah.
  // 5. `document.getElementById("my_modal_1").showModal()`: Menampilkan modal dialog dengan ID `my_modal_1`.

  const handleOpenModal = () => {
    setIsEditing(false); // Set mode ke tambah
    setEditingProduct(null); // Reset data edit
    setDataProduct({
      namaBarang: "",
      hargaBarang: "",
      stokBarang: "",
      categoryId: "",
      hargaAwal: "",
    }); // Reset form
    setImageFile(null);
    document.getElementById("my_modal_1").showModal();
  };

  // Fungsi `handleCloseModal` digunakan untuk menutup modal dan mereset data yang ada:
  // 1. `setIsEditing(false)`: Mengatur mode keluar dari "edit" jika sebelumnya aktif.
  // 2. `setEditingProduct(null)`: Menghapus data produk yang sedang diedit.
  // 3. `setDataProduct`: Mereset data form produk dengan nilai default kosong.
  // 4. `setImageFile(null)`: Menghapus file gambar yang mungkin telah diunggah.
  // 5. `document.getElementById("my_modal_1").close()`: Menutup modal dialog dengan ID `my_modal_1`.

  const handleCloseModal = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setDataProduct({
      namaBarang: "",
      hargaBarang: "",
      stokBarang: "",
      categoryId: "",
      hargaAwal: "",
    }); // Reset form
    setImageFile(null);
    document.getElementById("my_modal_1").close();
  };

  // Fungsi `fetchCategories` digunakan untuk mengambil daftar kategori dari server:
  // 1. Fungsi ini bersifat asinkron menggunakan `async/await`.
  // 2. Menggunakan `axioInstance.get("/category")` untuk mengirim permintaan GET ke endpoint `/category`.
  // 3. Jika berhasil, data kategori yang diterima dari server disimpan ke dalam state `categories` menggunakan `setCategories(response.data)`.
  // 4. Jika terjadi kesalahan, menampilkan pesan kesalahan menggunakan `alert(error)`.

  const fetchCategories = async () => {
    try {
      const response = await axioInstance.get("/category");
      setCategories(response.data);
    } catch (error) {
      alert(error);
    }
  };

  // Fungsi `fetchProduct` digunakan untuk mengambil daftar produk dari server:
  // 1. Fungsi ini bersifat asinkron menggunakan `async/await`.
  // 2. Menggunakan `axioInstance.get("/products")` untuk mengirim permintaan GET ke endpoint `/products`.
  // 3. Jika permintaan berhasil:
  //    - Data produk yang diterima dari server disimpan ke state `products` menggunakan `setProducts(response.data)`.
  //    - State `filteredProducts` juga diatur dengan data produk awal untuk menampilkan semua produk secara default.
  // 4. Jika terjadi kesalahan, menampilkan pesan kesalahan menggunakan `alert(error)`.

  const fetchProduct = async () => {
    try {
      const response = await axioInstance.get("/products");
      setProducts(response.data);
      setFilteredProducts(response.data); // Set produk awal
    } catch (error) {
      alert(error);
    }
  };

  // Fungsi `deleteProduct` digunakan untuk menghapus produk berdasarkan ID:
  // 1. Fungsi ini bersifat asinkron menggunakan `async/await`.
  // 2. Mencetak ID produk yang akan dihapus ke konsol untuk tujuan debugging.
  // 3. Menggunakan `axioInstance.delete(`/products/${id}`)` untuk mengirim permintaan DELETE ke endpoint `/products/{id}`.
  // 4. Jika permintaan berhasil:
  //    - Menampilkan pesan dari server melalui `alert(response.data.message)`.
  //    - Memanggil `fetchProduct()` untuk memperbarui daftar produk setelah penghapusan.
  // 5. Jika terjadi kesalahan:
  //    - Mencetak pesan kesalahan ke konsol untuk debugging.
  //    - Menampilkan pesan kesalahan kepada pengguna dengan `alert("Failed to delete product. Check console for details.")`.

  const deleteProduct = async (id) => {
    try {
      console.log("Deleting product with ID:", id); // Debug
      const response = await axioInstance.delete(`/products/${id}`);
      alert(response.data.message);
      fetchProduct();
    } catch (error) {
      console.error("Error deleting product:", error); // Debug
      alert("Failed to delete product. Check console for details.");
    }
  };

  // Fungsi `handleSubmit` digunakan untuk menangani pengiriman data produk, baik untuk menambahkan produk baru atau memperbarui produk yang sudah ada:
  // 1. Mencegah perilaku default form dengan `e.preventDefault()`.
  // 2. Membuat objek `FormData` untuk mengelola data yang akan dikirim, terutama untuk menangani file:
  //    - Menambahkan file gambar dengan `formData.append("image", imageFile)`.
  //    - Menambahkan properti produk lainnya (`namaBarang`, `hargaBarang`, `stokBarang`, `categoryId`, `hargaAwal`) ke `FormData`.
  // 3. Mengecek apakah ada produk yang sedang diedit (`editingProduct`):
  //    - Jika `editingProduct` ada, berarti mode edit, dan permintaan PATCH dikirim ke endpoint `/products/{id}` dengan `formData`.
  //    - Jika tidak, berarti mode tambah, dan permintaan POST dikirim ke endpoint `/products` dengan `formData`.
  // 4. Setelah berhasil:
  //    - Menampilkan pesan dari server dengan `alert(response.data.message)`.
  //    - Memanggil fungsi `fetchProduct` untuk memperbarui daftar produk.
  //    - Menutup modal dengan `handleCloseModal()`.
  // 5. Jika terjadi kesalahan:
  //    - Mencetak error ke konsol untuk debugging.
  //    - Menampilkan pesan kesalahan kepada pengguna dengan `alert("Error occurred while submitting.")`.

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", imageFile); // Menambahkan file gambar ke FormData
    formData.append("namaBarang", dataProduct.namaBarang);
    formData.append("hargaBarang", Number(dataProduct.hargaBarang));
    formData.append("stokBarang", Number(dataProduct.stokBarang));
    formData.append("categoryId", Number(dataProduct.categoryId));
    formData.append("hargaAwal", Number(dataProduct.hargaAwal));

    try {
      if (editingProduct) {
        // Update existing product
        const response = await axioInstance.patch(
          `/products/${editingProduct.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert(response.data.message);
      } else {
        // Create new product
        const response = await axioInstance.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert(response.data.message);
      }
      fetchProduct(); // Fetch products again after submission
      handleCloseModal(); // Close modal
    } catch (error) {
      console.log(error);
      alert("Error occurred while submitting.");
    }
  };

  // Fungsi `handleEditClick` digunakan untuk menginisiasi proses pengeditan produk:
  // 1. Mengatur `isEditing` ke `true`, yang menandakan bahwa aplikasi sedang dalam mode edit.
  // 2. Menyimpan produk yang sedang diedit ke dalam `editingProduct`.
  // 3. Mengatur data produk yang ada ke dalam state `dataProduct` sehingga form di modal dapat terisi dengan data produk yang ingin diedit:
  //    - `namaBarang`, `hargaBarang`, `stokBarang`, dan `categoryId` dari produk yang dipilih akan diatur.
  // 4. Memanggil `document.getElementById("my_modal_1").showModal()` untuk membuka modal yang berisi form pengeditan produk.

  const handleEditClick = (product) => {
    setIsEditing(true); // Set mode ke edit
    setEditingProduct(product);
    setDataProduct({
      namaBarang: product.namaBarang,
      hargaBarang: product.hargaBarang,
      stokBarang: product.stokBarang,
      categoryId: product.categoryId,
    });
    document.getElementById("my_modal_1").showModal();
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  // Fungsi `handleSearch` digunakan untuk menangani pencarian produk berdasarkan input pengguna:
  // 1. Mengambil nilai input pencarian dengan `e.target.value`, kemudian mengubahnya menjadi huruf kecil menggunakan `.toLowerCase()` untuk pencocokan yang tidak peka huruf besar/kecil.
  // 2. Menyimpan nilai pencarian dalam state `searchTerm` menggunakan `setSearchTerm(value)`.
  // 3. Melakukan penyaringan produk dengan metode `.filter()`:
  //    - Memeriksa apakah nama produk (`product.namaBarang`), nama kategori produk (`product.category?.nama`), harga produk (`product.hargaBarang`), atau stok produk (`product.stokBarang`) mengandung kata kunci pencarian (`value`).
  //    - Jika salah satu dari kondisi ini terpenuhi, produk akan disertakan dalam hasil penyaringan.
  // 4. Menyimpan hasil produk yang telah disaring dalam state `filteredProducts` menggunakan `setFilteredProducts(filtered)` sehingga daftar produk yang ditampilkan sesuai dengan hasil pencarian.

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = products.filter(
      (product) =>
        product.namaBarang.toLowerCase().includes(value) ||
        product.category?.nama.toLowerCase().includes(value) ||
        product.hargaBarang.toString().includes(value) ||
        product.stokBarang.toString().includes(value)
    );

    setFilteredProducts(filtered);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  return (
    <div className="h-52">
      {/* Input untuk pencarian */}
      <div className="relative mt-3 mb-2 space-x-6 ">
        <input
          type="text"
          className="input input-bordered w-full lg:w-96 pl-12"
          placeholder="Cari Barang . . . . ."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div
          className="btn bg-green-500 text-white hover:bg-green-900"
          onClick={handleOpenModal}
        >
          Tambah Barang
        </div>
      </div>
      <div className="overflow-x-auto fixed lg:relative  h-[29rem] transform">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Nama Barang</th>
              <th>Harga Awal</th>
              <th>Harga Barang</th>
              <th>Stok Barang</th>
              <th>Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index}>
                <td>
                  <img
                    className="h-32 w-32"
                    src={`http://localhost:3000/public/images/${product.picUrl}`}
                    alt=""
                  />
                </td>
                <td>{product.namaBarang}</td>
                <td>{formatRupiah(product.hargaAwal)}</td>
                <td>{formatRupiah(product.hargaBarang)}</td>

                <td>{product.stokBarang}</td>
                <td>{product.category?.nama}</td>
                <td className="space-x-3">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="btn btn-sm bg-yellow-500 text-white hover:bg-yellow-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="btn btn-sm bg-red-500 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal id="my_modal_1">
        <h1 className="text-3xl">
          {isEditing ? "Edit Barang" : "Input Barang"}
        </h1>
        <form
          className="mt-6 space-y-2 max-w-2xl mx-auto"
          onSubmit={handleSubmit}
        >
          <h3>Nama Barang</h3>
          <label className="input input-bordered flex items-center">
            <input
              type="text"
              className="grow"
              placeholder="Nama barang"
              value={dataProduct.namaBarang}
              onChange={(e) =>
                setDataProduct({ ...dataProduct, namaBarang: e.target.value })
              }
            />
          </label>
          <h3>Harga Awal</h3>
          <label className="input input-bordered flex items-center">
            <input
              type="number"
              className="grow"
              placeholder="Harga awal"
              value={dataProduct.hargaAwal}
              onChange={(e) =>
                setDataProduct({ ...dataProduct, hargaAwal: e.target.value })
              }
            />
          </label>
          <h3>Harga Barang</h3>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="number"
              className="grow"
              placeholder="Harga barang"
              value={dataProduct.hargaBarang}
              onChange={(e) =>
                setDataProduct({ ...dataProduct, hargaBarang: e.target.value })
              }
            />
          </label>
          <h3>Stok Barang</h3>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="number"
              className="grow"
              placeholder="Stok barang"
              value={dataProduct.stokBarang}
              onChange={(e) =>
                setDataProduct({ ...dataProduct, stokBarang: e.target.value })
              }
            />
          </label>
          <h3>Kategori</h3>
          <select
            className="select select-bordered w-full"
            value={dataProduct.categoryId}
            onChange={(e) =>
              setDataProduct({ ...dataProduct, categoryId: e.target.value })
            }
          >
            <option disabled value="">
              Pilih Kategori
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.nama}
              </option>
            ))}
          </select>

          <h3>Gambar</h3>
          <input
            type="file"
            onChange={hanldeFileChange}
            className="file-input file-input-bordered w-full"
          />
          <div className="modal-action space-x-4 p-6">
            <button
              type="submit"
              className="w-full py-3 px-6 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700"
            >
              {isEditing ? "Update Barang" : "Tambah Barang"}
            </button>
            <button
              type="button"
              className="w-full py-3 px-6 text-lg font-semibold text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700"
              onClick={handleCloseModal}
            >
              Tutup
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Barang;
