import React, { useRef, useState } from "react";
import { Form, Alert, Container } from "react-bootstrap";
import Button from "@mui/material/Button";
import { getDatabase, set, ref } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const nameRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    setMessage("");
    setError("");
    e.preventDefault();
    //Kanske hämta hem nuvarande informationen, lägg till det som lagts till i formet, gör ett tmpobj som sedan postas.

    try {
      const db = getDatabase();
      set(ref(db, "users/" + currentUser._delegate.uid), {
        name: nameRef.current.value,
      });
      setMessage("Profile was updated");
    } catch (error) {
      setError("Error, profile was not updated");
    }
  }

  function navigateToProfile() {
    navigate("/");
  }

  return (
    <Container className="shadow-container">
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control ref={nameRef} type="string" />
        </Form.Group>
        <Button variant="contained" className="mt-3" type="submit">
          Submit
        </Button>
      </Form>
      <Button variant="contained" className="mt-3" onClick={navigateToProfile}>
        Back to Profile
      </Button>
    </Container>
  );
}
