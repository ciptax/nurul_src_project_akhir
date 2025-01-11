// Komponen Register untuk menangani proses registrasi pengguna baru dengan validasi input dan pengiriman data ke server.
// 1. `useState` digunakan untuk mengelola data formulir (`formData`), validasi error (`errors`), dan status pengiriman (`isSubmitting`).
// 2. `handleChange` menangani perubahan pada input form dan memperbarui state `formData`.
// 3. `validateForm` memvalidasi input form, memastikan semua field yang diperlukan terisi. Jika ada error, error tersebut disimpan di state `errors`.
// 4. `handleSubmit` menangani pengiriman formulir. Data pengguna dikirim ke endpoint API `/api/register` menggunakan metode POST.
//    - Jika registrasi berhasil, pengguna akan menerima notifikasi sukses.
//    - Jika gagal, pesan error akan ditampilkan.
//    - Menggunakan `isSubmitting` untuk mencegah pengiriman ulang saat sedang diproses.

import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.fullName) formErrors.fullName = "Nama Lengkap diperlukan";
    if (!formData.email) formErrors.email = "Email diperlukan";
    if (!formData.password) formErrors.password = "Password diperlukan";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "customer",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registrasi berhasil!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mendaftar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('src/assets/items/bgaut.jpg')`, // URL gambar latar
      }}
    >
      <div className="absolute inset-0"></div>
      <div className="relative z-10 w-full max-w-md bg-black/55 rounded-3xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Buat Akun Baru
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-3 border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm">{errors.fullName}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                {isSubmitting ? "Mendaftar..." : "Daftar"}
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-white">
            Sudah punya akun?{" "}
            <a href="/login" className="text-blue-300 hover:underline">
              Masuk di sini
            </a>
          </p>
          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              © 2024 Toko Nurul Src. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
