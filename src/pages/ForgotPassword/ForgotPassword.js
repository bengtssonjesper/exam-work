import React, { useRef, useState } from "react";
import { Form, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { AuthContainer, AuthCard, AuthCardBody } from "../../styles/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    // <AuthContainer>
    //   <div className="w-100">
    //     <AuthCard>
    //       <AuthCardBody>
    //         <h2 className="text-center">Reset Password</h2>
    //         {error && <Alert variant="danger">{error}</Alert>}
    //         {message && <Alert variant="success">{message}</Alert>}
    //         <Form onSubmit={handleSubmit}>
    //           <Form.Group id="email">
    //             <Form.Label>Email</Form.Label>
    //             <Form.Control type="email" ref={emailRef} required />
    //           </Form.Group>
    //           <Button
    //             variant="contained"
    //             disabled={loading}
    //             className="mt-3 w-100"
    //             type="submit"
    //           >
    //             Reset Password
    //           </Button>
    //         </Form>
    //       </AuthCardBody>
    //     </AuthCard>
    //     <div className="w-100 text-center mt-2">
    //       Already have an account? <Link to="/login">Log In</Link>
    //     </div>
    //   </div>
    // </AuthContainer>

    <>
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

            <Button onClick={handleSubmit} variant="contained">
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
