
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PrivateRoute({ children, ...rest }) {
  const {  isAdmin } = useAuth();

  return isAdmin? <Outlet /> : <Navigate to="/" />;
}
