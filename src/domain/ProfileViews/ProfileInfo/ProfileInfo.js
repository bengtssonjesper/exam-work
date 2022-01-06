import React, { useState, useRef } from "react";
import { getDatabase, set, ref } from "firebase/database";
import { Form, Alert, Container } from "react-bootstrap";
import {
  ProfileBodyHeaderText,
  EditProfileButtonStyles,
} from "../../../pages/Profile/styles";
import { ProfileContainer } from "./styles";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

export default function ProfileInfo(props) {
  const nameRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);

  function handleSubmit(e) {
    setMessage("");
    setError("");
    e.preventDefault();

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

  return (
    <div>
      {!editingProfile && (
        // <ProfileContainer>
        <Card
          raised
          style={{ width: "min(1000px,95%)", margin: "30px auto 0 auto" }}
        >
          <CardContent>
            <Typography variant="h3">
              Welcome back&nbsp;
              {props.profileData && "name" in props.profileData && (
                <p style={{ display: "inline-block" }}>
                  {props.profileData.name}
                </p>
              )}
            </Typography>
            {currentUser && (
              <p>You are logged in as: {currentUser._delegate.email}</p>
            )}
            {currentUser && <p>Your userID is: {currentUser._delegate.uid}</p>}
            {props.profileData && "name" in props.profileData && (
              <p>Name: {props.profileData.name}</p>
            )}
            <Button
              variant="contained"
              style={{}}
              color="secondary"
              onClick={() => {
                setEditingProfile(true);
              }}
            >
              EDIT PROFILE INFO
            </Button>
          </CardContent>
        </Card>
        // </ProfileContainer>
      )}

      {editingProfile && (
        <Paper style={{ margin: "30px", padding: "10px" }}>
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
          <Button
            variant="contained"
            style={{ margin: "20px 0" }}
            color="secondary"
            onClick={() => {
              setEditingProfile(false);
            }}
          >
            BACK TO PROFILE
          </Button>
        </Paper>
      )}
    </div>
  );
}
