import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated || localStorage.getItem("token")
  );

  const role = localStorage.getItem("role");

  // Jika belum login, arahkan ke /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika role admin tetapi mencoba mengakses selain /admin, arahkan ke /admin
  if (role === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }

  // Jika role bukan admin tetapi mencoba mengakses /admin, arahkan ke /belanja
  if (role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/belanja" replace />;
  }

  // Jika semua kondisi terpenuhi, render komponen anak
  return children;
};

export default PrivateRoute;
