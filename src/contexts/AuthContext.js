import react, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { set, ref, getDatabase, onValue } from "firebase/database";

import { getAuth, updatePassword } from "firebase/auth";

const AuthContext = react.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Är det dåligt att vem som helst kan läsa UID av admins? Går det att "hacka" currentUser och sätta sitt uid på något sätt?
    //Sätter vi så endast admins kan läsa "admins" kan vi inte kolla om det är en admin från första början.
    const db = getDatabase();
    const adminRef = ref(db, "Admins");
    onValue(adminRef, (snapshot) => {
      const admins = snapshot.val();
      if (admins && currentUser && currentUser._delegate.uid in admins) {
        setIsAdmin(true);
      }else{
        setIsAdmin(false);
      }
    });
  }, [currentUser]);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function ownUpdatePassword(user, password) {
    return updatePassword(user, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    isAdmin,
    ownUpdatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
