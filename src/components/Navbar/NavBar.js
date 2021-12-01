import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  function navigateToBookingDashboard() {
    navigate("/bookingdashboard");
  }

  function navigateToProfile() {
    navigate("/");
  }

  function navigateToLogin() {
    navigate("/login");
  }

  function navigateToSignUp() {
    navigate("/signup");
  }
  function navigateToAdmin() {
    navigate("/admin");
  }

  async function handleLogOut() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      //Some error
    }
  }

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Booking System</Navbar.Brand>
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
            {currentUser && (
              <Nav.Link onClick={navigateToAdmin}>Admin page</Nav.Link>
            )}
          </Nav>

          <Nav>
            {!currentUser && (
              <Nav.Link onClick={navigateToLogin}>Log In</Nav.Link>
            )}
            {currentUser && <Nav.Link onClick={handleLogOut}>Log Out</Nav.Link>}
            {!currentUser && (
              <Nav.Link onClick={navigateToSignUp}>Sign Up</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
