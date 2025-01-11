// Komponen Contact digunakan untuk menangani formulir kontak.
// 1. `useState` digunakan untuk mengelola data formulir (`formData`), pesan respons (`responseMessage`), dan error validasi (`errors`).
// 2. `handleChange` menangani perubahan input formulir dan memperbarui state `formData`.
// 3. `handleSubmit` memvalidasi input, mengirim data ke API endpoint `/api/contact`, dan menangani respons.
//    - Validasi memeriksa apakah semua field wajib diisi dan apakah format email valid.
//    - Jika validasi gagal, pesan error disimpan di state `errors`.
//    - Jika validasi berhasil, data dikirim ke server menggunakan metode POST.
//    - Setelah berhasil mengirim, formulir direset dan pesan respons ditampilkan.

import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nama wajib diisi.";
    if (!formData.email) newErrors.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format email tidak valid.";
    if (!formData.message) newErrors.message = "Pesan wajib diisi.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await fetch("http://localhost:3000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await res.json();

        if (res.ok) {
          setResponseMessage("Pesan berhasil dikirim!");
          setFormData({ name: "", email: "", message: "" });
        } else {
          setResponseMessage(result.error || "Gagal mengirim pesan.");
        }
      } catch (error) {
        setResponseMessage("Terjadi kesalahan, silakan coba lagi.");
      }
    }
  };

  return (
    <div className="mt-16 min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Tinggalkan Pesan Anda Disini
        </h1>
        <div className="bg-white shadow-xl rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama Anda"
                className={`input input-bordered ${
                  errors.name ? "input-error" : ""
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Anda"
                className={`input input-bordered ${
                  errors.email ? "input-error" : ""
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pesan</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tulis pesan Anda di sini..."
                className={`textarea textarea-bordered ${
                  errors.message ? "textarea-error" : ""
                }`}
                rows="5"
              ></textarea>
              {errors.message && (
                <span className="text-red-500 text-sm">{errors.message}</span>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Kirim Pesan
            </button>
          </form>
          {responseMessage && (
            <p className="text-center mt-4 text-lg text-gray-700">
              {responseMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
