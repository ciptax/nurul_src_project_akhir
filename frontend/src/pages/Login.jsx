import React from "react";
import axiosInstance from "../axiosInstance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const role = localStorage.getItem("role");
      const redirect = role === "admin" ? "/admin" : "/belanja";
      navigate(redirect);
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const result = await axiosInstance.post("/login", credentials);
      const user = result.data;
      dispatch({ type: "LOGIN", payload: { user } });
      navigate("/admin");
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed! Please check your credentials.");
    }
  };

  return (
    <div
      className="min-h-screen bg-black/55 flex items-center justify-center p-4 bg-cover "
      style={{
        backgroundImage: "url('src/assets/items/bgaut.jpg')",
      }}
    >
      <div className="w-full sm:w-96 bg-black/55 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Login Nurul SRC
        </h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-white"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="Masukkan Email Anda"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-white"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Masukkan Password Anda"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-white">
          Belum punya akun?{" "}
          <a href="/register" className="text-indigo-300 hover:underline">
            Daftar di sini
          </a>
        </p>

        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            © 2024 Toko Nurul Src. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
