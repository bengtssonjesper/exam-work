import { useRef, useState } from "react";
import { Form, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
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
import { useSelector } from "react-redux";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const { login } = useAuth();
  const darkMode = useSelector((state) => state.bookings.darkMode);
  const inputDarkStyle = {
    WebkitBoxShadow: "0 0 0 30px rgba(0,0,0,0.3) inset",
    padding: "3px",
  };
  const inputLightStyle = {
    WebkitBoxShadow: "0 0 0 30px rgba(240,240,200,0.3) inset",
    padding: "3px",
  };

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(enteredEmail, enteredPassword);
      navigate("/", { replace: true });
    } catch {
      setError("Failed to sign in");
    }
    setLoading(false);
  }

  function handleEmailInputChange(e) {
    setEnteredEmail(e.target.value);
  }
  function handlePasswordInputChange(e) {
    setEnteredPassword(e.target.value);
  }

  return (
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
            height: "350px",
            margin: "auto",
          }}
          variant="outlined"
        >
          <CardHeader title="Login" />
          <CardContent
            sx={{
              height: "90%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            {error && <Alert variant="warning">{error}</Alert>}
            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              onChange={handleEmailInputChange}
              inputProps={{
                style: darkMode ? inputDarkStyle : inputLightStyle,
              }}
            />
            <TextField
              id="standard-basic"
              label="Password"
              variant="standard"
              type="password"
              onChange={handlePasswordInputChange}
              inputProps={{
                style: darkMode ? inputDarkStyle : inputLightStyle,
              }}
            />
            <Button onClick={handleSubmit} variant="contained">
              Log In
            </Button>
            <div className="w-100 text-center">
              Forgot password? <Link to="/forgotpassword">Reset Password</Link>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
