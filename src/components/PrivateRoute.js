import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  //   return (
  // <Route
  //   {...rest}
  //   render={(props) =>
  //     currentUser ? <Component {...props} /> : <Navigate to="login" />
  //   }
  // />
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return <Route path="/profile" element={<Component />} />;
  //   );
}
