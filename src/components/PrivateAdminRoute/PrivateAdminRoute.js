import { onValue, ref, getDatabase } from "@firebase/database";
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PrivateRoute({ children, ...rest }) {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(checkIsAdmin());
  }, []);

  function checkIsAdmin() {
    var isAdmin = false;
    const db = getDatabase();
    const adminsRef = ref(db, "Admins");
    onValue(adminsRef, (snapshot) => {
      const data = snapshot.val();
      Object.keys(data).forEach((element) => {
        if (currentUser && currentUser._delegate.uid === element) {
          isAdmin = true;
        }
      });
    });
    // return isAdmin;
    return true;
  }

  return checkIsAdmin() ? <Outlet /> : <Navigate to="/" />;
}
