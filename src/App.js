import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PrivateAdminRoute from "./components/PrivateAdminRoute/PrivateAdminRoute";
import Profile from "./pages/Profile/Profile";
import BookingDashboard from "./pages/BookingDashboard/BookingDashboard";
import EditProfile from "./pages/EditProfile/EditProfile";
import NavBar from "./components/Navbar/NavBar";
import AdminPage from "./pages/AdminPage/AdminPage";
import { Background } from "./styles/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { theme } from "./styles/theme";
import { ThemeProvider } from "@mui/material/styles";

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <Background> */}
        {/* <div className="background"> */}
        <ThemeProvider theme={theme}>
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
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
        </ThemeProvider>
        {/* </div> */}
        {/* </Background> */}
      </AuthProvider>
    </Router>
  );
}

export default App;
