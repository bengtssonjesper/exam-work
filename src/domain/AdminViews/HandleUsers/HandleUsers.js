import React, { useEffect, useRef, useState } from "react";
import { getDatabase, set, ref } from "firebase/database";
import { useAuth } from "../../../contexts/AuthContext";
import { Form, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
var generator = require("generate-password");

export default function HandleUsers(props) {
  const { signup } = useAuth();
  const { deleteUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const allUsers = useSelector((state) => state.bookings.users);

  function generatePassword() {
    const passwordInput = document.getElementById("enteredPassword");
    const password = generator.generate({ length: 10, numbers: true });
    passwordInput.value = password;
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
    setMessage("");
    setError("");
    const db = getDatabase();
    try {
      setLoading(true);
      const promise = await signup(enteredEmail, enteredPassword);
      set(ref(db, "users/" + promise.user._delegate.uid), {
        uid: promise.user._delegate.uid,
        email: enteredEmail,
      });
      setMessage("User created");
    } catch (error) {
      setError("Failed to create an account");
    }
    setLoading(false);
  }
  // async function handleAddUser(e) {
  //   e.preventDefault();
  //   setMessage("");
  //   setError("");
  //   const db = getDatabase();
  //   try {
  //     setLoading(true);
  //     const promise = await signup(
  //       emailRef.current.value,
  //       passwordRef.current.value
  //     );
  //     set(ref(db, "users/" + promise.user._delegate.uid), {
  //       uid: promise.user._delegate.uid,
  //       email: emailRef.current.value,
  //     });
  //     setMessage("User created");
  //   } catch (error) {
  //     setError("Failed to create an account");
  //   }
  //   setLoading(false);
  // }

  function handleEmailInputChange(e) {
    setEnteredEmail(e.target.value);
  }

  function handlePasswordInputChange(e) {
    setEnteredPassword(e.target.value);
  }

  return (
    <div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {/* <Form onSubmit={handleAddUser}>
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
      </Form> */}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "70vh" }}
      >
        <Card
          sx={{
            width: "min(400px,85vw)",
            height: "350px",
            margin: "auto",
          }}
          variant="outlined"
        >
          <CardHeader title="Add User" />
          <CardContent
            sx={{
              height: "90%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              component="form"
              onSubmit={handleAddUser}
              sx={{
                height: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <TextField
                required
                id="enteredEmail"
                label="Email"
                variant="standard"
                onChange={handleEmailInputChange}
              />
              <TextField
                required
                id="enteredPassword"
                label="Password"
                variant="standard"
                type={showPassword ? "text" : "password"}
                onChange={handlePasswordInputChange}
              />
              <FormControlLabel
                onChange={(event) => {
                  handleShowPassword(event);
                }}
                control={<Checkbox />}
                label="Show Password"
              />
              <Button
                variant="contained"
                color="warning"
                onClick={generatePassword}
              >
                Generate Password
              </Button>
              <Button onClick={handleAddUser} variant="contained">
                Add User
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
