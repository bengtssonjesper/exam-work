import React, { useState, useEffect, useRef } from "react";
import "../../styles/styles.css";
import { ref, getDatabase } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, Accordion, Form } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { onValue } from "@firebase/database";
import { useSelector, useDispatch } from "react-redux";
import {
  reduxFormatData,
  reduxFormatUsers,
} from "../../helper/HelperFunctions";
import {
  ProfileHeader,
  ProfileBody,
  ProfileInfo,
  ProfileBookings,
  ProfileBodyHeaderText,
  AccordionStyles,
  EditProfileButtonStyles,
  ShowOnDesktop,
  ShowOnMobile,
} from "./styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@material-ui/core/styles";

export default function Profile() {
  const defaultTheme = useTheme();
  const oldPasswordRef = useRef("");
  const newPasswordRef = useRef("");
  const confirmPasswordRef = useRef();
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState();
  const [whatView, setWhatView] = useState(0);
  const { login, ownUpdatePassword } = useAuth();
  const [enteredOldPassword, setEnteredOldPassword] = useState("");
  const [enteredNewPassword, setEnteredNewPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const offices = useSelector((state) => state.bookings.offices);
  const currentUsersBookings = useSelector(
    (state) => state.bookings.currentUsersBookings
  );
  const darkMode = useSelector((state) => state.bookings.darkMode);

  const inputDarkStyle = {
    WebkitBoxShadow: "0 0 0 30px rgba(0,0,0,0.3) inset",
    padding: "3px",
  };
  const inputLightStyle = {
    WebkitBoxShadow: "0 0 0 30px rgba(0,50,0,0.5) inset",
    padding: "3px",
  };

  useEffect(() => {
    function getProfileData() {
      try {
        const db = getDatabase();
        const profileRef = ref(db, "users/" + currentUser._delegate.uid);
        onValue(profileRef, (snapshot) => {
          const data = snapshot.val();
          setProfileData(data);
        });
      } catch (error) {
        setError("Error getting profile data");
      }
    }
    getProfileData();
  }, [currentUser._delegate.uid]);

  useEffect(() => {
    const db = getDatabase();
    const reduxAllOfficesRef = ref(db, "Offices");
    if (offices.length === 0) {
      onValue(reduxAllOfficesRef, (snapshot) => {
        const data = snapshot.val();
        reduxFormatData(data, currentUser, dispatch);
      });
    }
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxUsersRef = ref(db, "users");
    onValue(reduxUsersRef, (snapshot) => {
      const data = snapshot.val();
      reduxFormatUsers(data, dispatch);
    });
  }, []);

  function handleEditProfile() {
    navigate("/editprofile");
  }

  const handleChangeView = (event, newValue) => {
    setWhatView(newValue);
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
      console.log("error: ", error);
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
    <>
      <ProfileHeader
        style={{
          backgroundColor: darkMode ? "rgb(50,50,50)" : "rgb(230,230,230)",
          boxShadow: darkMode
            ? "rgba(200, 200, 200, 0.35) 0px 5px 15px"
            : "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Typography
          variant="h3"
          color={darkMode ? "rgb(200,200,200)" : "rgb(50,50,50)"}
        >
          PROFILE
        </Typography>
        <ShowOnDesktop>
          <Tabs
            value={whatView}
            onChange={handleChangeView}
            aria-label="icon label tabs example"
          >
            <Tab icon={<AccountCircleIcon />} label="PROFILE INFO" />
            <Tab icon={<MenuBookIcon />} label="YOUR BOOKINGS" />
            <Tab icon={<MenuBookIcon />} label="UPDATE PASSWORD" />
          </Tabs>
        </ShowOnDesktop>
        <ShowOnMobile>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Select
            </InputLabel>
            <Select
              onChange={(e) => {
                setWhatView(parseInt(e.target.value));
              }}
              defaultValue={0}
            >
              <MenuItem value={0}>PROFILE INFO</MenuItem>
              <MenuItem value={1}>YOUR BOOKINGS</MenuItem>
              <MenuItem value={2}>UPDATE PASSWORD</MenuItem>
            </Select>
          </FormControl>
        </ShowOnMobile>
      </ProfileHeader>

      <ProfileBody>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {whatView === 0 && (
          <ProfileInfo>
            <ProfileBodyHeaderText>Profile info</ProfileBodyHeaderText>
            {currentUser && (
              <p>You are logged in as: {currentUser._delegate.email}</p>
            )}
            {profileData && "name" in profileData && (
              <p>Name: {profileData.name}</p>
            )}
            <Button
              variant="contained"
              style={EditProfileButtonStyles}
              color="secondary"
              onClick={handleEditProfile}
            >
              EDIT PROFILE INFO
            </Button>
          </ProfileInfo>
        )}

        {whatView === 1 && (
          <ProfileBookings>
            <ProfileBodyHeaderText>
              Expand the accordion below to view your bookings
            </ProfileBodyHeaderText>
            <Accordion style={AccordionStyles}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Show My Bookings</Accordion.Header>
                <Accordion.Body>
                  <Accordion>
                    {Object.keys(currentUsersBookings).map((element, i) => {
                      return (
                        <Accordion.Item key={i} eventKey={i}>
                          <Accordion.Header>{element}</Accordion.Header>
                          <Accordion.Body>
                            {currentUsersBookings[element].map((booking, j) => {
                              return (
                                <div
                                  style={{ color: "black" }}
                                  key={j}
                                  className="d-flex justify-content-between "
                                >
                                  <p>Office: {booking.office}</p>
                                  <p>Seat: {booking.seat}</p>
                                  <p>Start Time: {booking.startTime}</p>
                                  <p>End Time: {booking.endTime}</p>
                                </div>
                              );
                            })}
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </ProfileBookings>
        )}
        {whatView === 2 && (
          // <div>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            // style={{ height: "40vh" }}
          >
            <Card
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
          // </div>
        )}
        {/* <Button onClick={addBooking}>Add Booking</Button> */}
      </ProfileBody>
    </>
  );
}
