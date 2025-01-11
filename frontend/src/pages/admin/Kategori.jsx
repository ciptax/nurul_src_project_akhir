// 1. `useState`: Hook ini digunakan untuk mendeklarasikan state dalam komponen fungsional React.
//    - `useState` digunakan untuk menyimpan nilai state yang bisa diubah dalam komponen tersebut. Misalnya, untuk menyimpan data modal atau informasi lainnya.
// 2. `useEffect`: Hook ini digunakan untuk melakukan efek samping dalam komponen React, seperti fetching data, subscribing events, atau melakukan perubahan langsung setelah rendering komponen.
//    - Dalam contoh ini, `useEffect` kemungkinan akan digunakan untuk melakukan fetching data ketika komponen pertama kali dimuat atau saat kondisi tertentu berubah.
// 3. `Modal`: Merupakan komponen modal yang bisa digunakan ulang di berbagai tempat. Biasanya komponen modal digunakan untuk menampilkan dialog atau form tambahan di atas konten lainnya.
//    - Di sini, `Modal` diimpor dari folder `../../components/Modal`, yang berarti ada file `Modal.js` atau `Modal.jsx` di folder tersebut.
// 4. `axiosInstance`: Merupakan instance dari Axios yang dikonfigurasi sebelumnya. Ini digunakan untuk melakukan HTTP requests.
//    - Penggunaan instance Axios memungkinkan pengaturan default untuk headers, base URL, atau pengaturan lainnya agar tidak perlu mengonfigurasi setiap kali melakukan request.
import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import axiosInstance from "../../axiosInstance";

// 1. `useState`: Digunakan untuk mendeklarasikan state dalam komponen fungsional React.
//    - `categories`: Menyimpan data kategori yang diambil dari API atau sumber lain.
//    - `isEditing`: Menyimpan status apakah sedang dalam mode edit atau tidak.
//    - `categoryData`: Menyimpan data kategori yang akan ditambahkan atau diedit, seperti nama kategori.
//    - `editingCategory`: Menyimpan kategori yang sedang diedit.
const Kategori = () => {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryData, setCategoryData] = useState({ nama: "" });
  const [editingCategory, setEditingCategory] = useState(null);

  // 1. `handleOpenModal`: Fungsi ini akan membuka modal kategori dengan memanggil `showModal()` pada elemen dengan ID "modal_kategori".
  // 2. `handleCloseModal`: Fungsi ini akan menutup modal kategori dengan memanggil `close()` pada elemen dengan ID "modal_kategori".
  //    Selain itu, fungsi ini juga akan mengatur ulang beberapa state:
  //    - `setIsEditing(false)`: Mengatur status editing menjadi false, yang menandakan bahwa modal tidak dalam mode edit.
  //    - `setEditingCategory(null)`: Mengatur kategori yang sedang diedit menjadi null, menandakan tidak ada kategori yang sedang diedit.
  //    - `setCategoryData({ nama: "" })`: Mengatur data kategori kembali ke nilai awal (kosong) setelah modal ditutup.
  const handleOpenModal = () => {
    document.getElementById("modal_kategori").showModal();
  };

  const handleCloseModal = () => {
    document.getElementById("modal_kategori").close();
    setIsEditing(false);
    setEditingCategory(null);
    setCategoryData({ nama: "" });
  };

  // `fetchCategories`: Fungsi ini digunakan untuk mengambil data kategori dari API.
  // - Menggunakan `axiosInstance.get("/category")` untuk melakukan GET request ke endpoint "/category".
  // - Jika berhasil, data kategori yang diterima dari response disimpan dalam state `categories` menggunakan `setCategories(response.data)`.
  // - Jika terjadi kesalahan (error), sebuah alert akan ditampilkan dengan pesan "Gagal mengambil data kategori."
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category");
      setCategories(response.data);
    } catch (error) {
      alert("Gagal mengambil data kategori.");
    }
  };

  // `handleSubmit`: Fungsi ini menangani pengiriman form untuk menambahkan atau memperbarui kategori.
  // - Menggunakan `e.preventDefault()` untuk mencegah reload halaman saat form disubmit.
  // - Jika `isEditing` true dan `editingCategory` ada, artinya pengguna sedang mengedit kategori yang sudah ada. Maka, melakukan PUT request untuk memperbarui kategori yang ada dengan `axiosInstance.put()`.
  // - Jika tidak dalam mode editing, maka akan membuat kategori baru menggunakan POST request (`axiosInstance.post()`).
  // - Setelah operasi selesai, `fetchCategories()` dipanggil untuk mengambil ulang daftar kategori dan memastikan data terbaru tampil di UI.
  // - Modal akan ditutup menggunakan `handleCloseModal()`.
  // - Jika terjadi kesalahan, alert dengan pesan "Gagal menyimpan kategori." akan ditampilkan.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editingCategory) {
        // Update existing category
        await axiosInstance.put(
          `/category/${editingCategory.id}`,
          categoryData
        );
        alert("Kategori berhasil diperbarui.");
      } else {
        // Create new category
        await axiosInstance.post("/category", categoryData);
        alert("Kategori berhasil ditambahkan.");
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      alert("Gagal menyimpan kategori.");
    }
  };

  // `handleDelete`: Fungsi ini menangani penghapusan kategori.
  // - Menerima `id` kategori yang akan dihapus sebagai parameter.
  // - Melakukan DELETE request ke API menggunakan `axiosInstance.delete()` untuk menghapus kategori berdasarkan `id` yang diberikan.
  // - Jika penghapusan berhasil, akan menampilkan alert dengan pesan "Kategori berhasil dihapus." dan memanggil `fetchCategories()` untuk memperbarui daftar kategori di UI.
  // - Jika terjadi kesalahan, alert dengan pesan "Gagal menghapus kategori." akan ditampilkan.
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/category/${id}`);
      alert("Kategori berhasil dihapus.");
      fetchCategories();
    } catch (error) {
      alert("Gagal menghapus kategori.");
    }
  };

  // `handleEditClick`: Fungsi ini dipanggil ketika tombol edit kategori ditekan.
  // - Menerima objek `category` yang akan diedit sebagai parameter.
  // - Mengatur state `isEditing` menjadi `true` untuk menunjukkan mode edit.
  // - Mengatur state `editingCategory` dengan kategori yang dipilih untuk proses edit.
  // - Mengatur state `categoryData` untuk mengisi form dengan data kategori yang ada, dalam hal ini hanya `nama` yang diedit.
  // - Memanggil `handleOpenModal()` untuk membuka modal yang berisi form edit kategori.
  const handleEditClick = (category) => {
    setIsEditing(true);
    setEditingCategory(category);
    setCategoryData({ nama: category.nama });
    handleOpenModal();
  };

  useEffect(() => {
    fetchCategories(); // Memanggil fungsi `fetchCategories` untuk mengambil data kategori ketika komponen pertama kali dimuat.
  }, []); // Dependency array kosong memastikan `fetchCategories` hanya dipanggil sekali pada saat mount.

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg overflow-x-auto fixed lg:relative  h-[32rem] transform">
      <h1 className="text-3xl font-bold mb-6">Kategori</h1>

      {/* Button to add category */}
      <button
        className="btn bg-green-500 text-white hover:bg-green-700 mb-4"
        onClick={handleOpenModal}
      >
        Tambah Kategori
      </button>

      {/* Table of categories */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>{category.nama}</td>
                <td className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="btn btn-sm bg-yellow-500 text-white hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn btn-sm bg-red-500 text-white hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding/editing category */}
      <Modal id="modal_kategori">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Kategori" : "Tambah Kategori"}
        </h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="label">
            <span className="label-text">Nama Kategori</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Nama Kategori"
            value={categoryData.nama}
            onChange={(e) =>
              setCategoryData({ ...categoryData, nama: e.target.value })
            }
          />
          <div className="modal-action space-x-4">
            <button type="submit" className="btn btn-success">
              {isEditing ? "Update Kategori" : "Tambah Kategori"}
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={handleCloseModal}
            >
              Batal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Kategori;
