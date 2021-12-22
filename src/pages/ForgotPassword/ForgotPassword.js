import React, { useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(enteredEmail);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  function handleEmailInputChange(e) {
    setEnteredEmail(e.target.value);
  }

  return (
    <>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "90vh" }}
      >
        <Card
          sx={{
            width: "min(400px,85vw)",
            height: "300px",
            margin: "auto",
          }}
          variant="outlined"
        >
          <CardHeader title="Reset Password" />
          <CardContent
            sx={{
              height: "90%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              onChange={handleEmailInputChange}
            />

            <Button
              disabled={loading}
              onClick={handleSubmit}
              variant="contained"
            >
              Reset Password
            </Button>
            <div className="w-100 text-center mt-2">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
