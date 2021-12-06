import React, { useEffect, useRef, useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { Form, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
var generator = require("generate-password");

export default function HandleUsers(props) {
  const { signup } = useAuth();
  const { deleteUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  useEffect(() => {
    console.log("props: ", props.users);
  }, []);

  function generatePassword() {
    const passwordInput = document.getElementById("passwordInput");
    const password = generator.generate({ length: 10, numbers: true });
    passwordInput.value = password;
    console.log("pass: ", password);
  }

  function handleShowPassword(e) {
    if (e.target.checked) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  }

  async function handleAddUser(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      setMessage("User created");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleAddUser}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control ref={emailRef} type="text" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            ref={passwordRef}
            id="passwordInput"
            type={showPassword ? "text" : "password"}
          />
          <Form.Check
            onChange={(event) => {
              handleShowPassword(event);
            }}
            id="toggle"
            type="checkbox"
            label="Show password"
          />
          <Button
            variant="contained"
            color="warning"
            onClick={generatePassword}
          >
            Generate Password
          </Button>
        </Form.Group>
        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          color="success"
        >
          Add user
        </Button>
      </Form>
    </div>
  );
}
