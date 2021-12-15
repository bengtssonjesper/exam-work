import * as React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PrivateAdminRoute from "./components/PrivateAdminRoute/PrivateAdminRoute";
import Profile from "./pages/Profile/Profile";
import BookingDashboard from "./pages/BookingDashboard/BookingDashboard";
import EditProfile from "./pages/EditProfile/EditProfile";
import NavBar from "./components/Navbar/NavBar";
import AdminPage from "./pages/AdminPage/AdminPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { theme } from "./styles/theme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const darkMode = useSelector((state) => state.bookings.darkMode);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar />
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path="/" element={<Profile />} />
            </Route>
            <Route path="/bookingdashboard" element={<PrivateRoute />}>
              <Route path="/bookingdashboard" element={<BookingDashboard />} />
            </Route>
            <Route path="/editprofile" element={<PrivateRoute />}>
              <Route path="/editprofile" element={<EditProfile />} />
            </Route>
            <Route path="/admin" element={<PrivateAdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
