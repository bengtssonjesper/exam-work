import React, { useRef, useState } from "react";
import { Form, Card, Alert, Container } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import {AuthContainer, AuthCard, AuthCardBody} from '../../styles/styles'

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <AuthContainer>
      <div className="w-100">
        <AuthCard>
          <AuthCardBody>
            <h2 className="text-center">Reset Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Button
                variant="contained"
                disabled={loading}
                className="mt-3 w-100"
                type="submit"
              >
                Reset Password
              </Button>
            </Form>
          </AuthCardBody>
        </AuthCard>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </AuthContainer>
  );
}
