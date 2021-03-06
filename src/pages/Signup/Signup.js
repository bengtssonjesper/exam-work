import React, { useRef, useState } from "react";
import { Card, Form, Container, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {AuthContainer, AuthCard, AuthCardBody} from '../../styles/styles'

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  // const { signup } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords dont match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      //   navigate.push("/");
      navigate("/", { replace: true });
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <AuthContainer>
      <div className="w-100">
        <AuthCard>
          <AuthCardBody>
            <h2 className="text-center">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id="passwordConfirm">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
              <Button
                variant="contained"
                disabled={loading}
                className="mt-3 w-100"
                type="submit"
              >
                Sign Up
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
