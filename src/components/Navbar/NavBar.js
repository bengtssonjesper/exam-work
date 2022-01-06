import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import { bookingsActions } from "../../store/bookings";
import { useSelector, useDispatch } from "react-redux";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function NavBar() {
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const darkMode = useSelector((state) => state.bookings.darkMode);
  const dispatch = useDispatch();

  function navigateToBookingDashboard() {
    navigate("/bookingdashboard");
  }

  function navigateToProfile() {
    navigate("/");
  }

  function navigateToLogin() {
    navigate("/login");
  }

  // function navigateToSignUp() {
  //   navigate("/signup");
  // }
  function navigateToAdmin() {
    navigate("/admin");
  }

  async function handleLogOut() {
    try {
      await logout();
      navigate("/login");
      dispatch(bookingsActions.clearStore());
    } catch (error) {
      //Some error
    }
  }

  function toggleDarkMode() {
    darkMode
      ? dispatch(bookingsActions.setDarkMode(false))
      : dispatch(bookingsActions.setDarkMode(true));
  }

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand
          style={{
            fontFamily: "Play",
            fontSize: "30px",
          }}
        >
          BookQ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {currentUser && (
              <Nav.Link onClick={navigateToProfile}>Profile</Nav.Link>
            )}
            {currentUser && (
              <Nav.Link onClick={navigateToBookingDashboard}>
                Book Seat
              </Nav.Link>
            )}
            {currentUser && isAdmin && (
              <Nav.Link onClick={navigateToAdmin}>Admin page</Nav.Link>
            )}
          </Nav>

          <Nav>
            <Nav.Link onClick={toggleDarkMode}>
              {!darkMode && <DarkModeIcon />}
              {darkMode && <LightModeIcon />}
            </Nav.Link>
            {!currentUser && (
              <Nav.Link onClick={navigateToLogin}>Log In</Nav.Link>
            )}
            {currentUser && <Nav.Link onClick={handleLogOut}>Log Out</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
