import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

export default function UpdatePassword() {
  const { currentUser, login, ownUpdatePassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [enteredOldPassword, setEnteredOldPassword] = useState("");
  const [enteredNewPassword, setEnteredNewPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const darkMode = useSelector((state) => state.bookings.darkMode);

  const inputDarkStyle = {
    WebkitBoxShadow: "0 0 0 30px rgba(0,0,0,0.3) inset",
    padding: "3px",
  };
  const inputLightStyle = {
    WebkitBoxShadow: "0 0 0 30px rgba(240,240,200,0.3) inset",

    padding: "3px",
    "&::placeholder": {
      color: "green",
    },
  };

  async function handlePasswordChange(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      //This is to confirm the old password
      const loginPromise = await login(
        currentUser._delegate.email,
        enteredOldPassword
      );
      if (loginPromise) {
        if (enteredNewPassword === enteredConfirmPassword) {
          await ownUpdatePassword(currentUser, enteredNewPassword).then(
            setMessage("Password updated")
          );
        } else {
          throw "New Passwords not matching";
        }
      } else {
        throw "Old password wrong";
      }
    } catch (error) {
      setError("error");
    }
  }

  function handleOldPasswordInputChange(e) {
    setEnteredOldPassword(e.target.value);
  }
  function handleNewPasswordInputChange(e) {
    setEnteredNewPassword(e.target.value);
  }
  function handleConfirmPasswordInputChange(e) {
    setEnteredConfirmPassword(e.target.value);
  }

  return (
    <div>
      {error && <Alert>{error}</Alert>}
      {message && <Alert>{message}</Alert>}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        // style={{ height: "40vh" }}
      >
        <Card
          raised
          style={{
            height: "100%",
            width: "min(400px,85vw)",
            textAlign: "center",
            margin: "30px 0",
          }}
        >
          <CardHeader title="Change Password" />
          <CardContent
          // sx={{
          //   height: "90%",
          //   display: "flex",
          //   flexDirection: "column",
          //   justifyContent: "space-evenly",
          // }}
          >
            <Box
              component="form"
              onSubmit={handlePasswordChange}
              sx={{
                height: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <TextField
                required
                id="old-password"
                label="Old Password"
                variant="standard"
                type="password"
                onChange={handleOldPasswordInputChange}
                inputProps={{
                  style: darkMode ? inputDarkStyle : inputLightStyle,
                }}
              />
              <TextField
                required
                id="new-password"
                label="New Password"
                variant="standard"
                type="password"
                onChange={handleNewPasswordInputChange}
                inputProps={{
                  style: darkMode ? inputDarkStyle : inputLightStyle,
                }}
              />
              <TextField
                required
                id="confirm-password"
                label="Confirm Password"
                variant="standard"
                type="password"
                onChange={handleConfirmPasswordInputChange}
                inputProps={{
                  style: darkMode ? inputDarkStyle : inputLightStyle,
                }}
              />
              <Button variant="contained" type="submit">
                Change Password
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
