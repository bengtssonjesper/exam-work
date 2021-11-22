import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import Profile from "./Profile";
import BookingDashboard from "./BookingDashboard";
import EditProfile from "./EditProfile";
import NavBar from "./NavBar";
import AdminPage from "./AdminPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar/>
        <Routes>
          <Route exact path="/" element={<PrivateRoute/>}>
            <Route exact path="/" element={<Profile />} />
          </Route>
          <Route  path="/bookingdashboard" element={<PrivateRoute/>}>
            <Route  path="/bookingdashboard" element={<BookingDashboard />} />
          </Route>
          <Route  path="/editprofile" element={<PrivateRoute/>}>
            <Route  path="/editprofile" element={<EditProfile />} />
          </Route>
          <Route  path="/admin" element={<PrivateRoute/>}>
            <Route  path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
