import React, { useState, useEffect, useRef } from "react";
import { MainContainer } from "../../styles/styles";
import "../../styles/styles.css";
import { set, ref, getDatabase } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, Container, Accordion, Form } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { onValue, update } from "@firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { reduxFormatData } from "../../helper/HelperFunctions";
import {
  ProfileHeader,
  ProfileBody,
  ProfileInfo,
  ProfileBookings,
  ProfileBodyHeaderText,
  AccordionStyles,
  EditProfileButtonStyles,
} from "./styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { theme } from "../../styles/theme";
import { v4 as uuidv4 } from "uuid";

export default function Profile() {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState();
  const [whatView, setWhatView] = useState(0);
  const { login, ownUpdatePassword } = useAuth();

  const dispatch = useDispatch();
  const offices = useSelector((state) => state.bookings.offices);
  const currentUsersBookings = useSelector(
    (state) => state.bookings.currentUsersBookings
  );

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
    console.log("password: ", currentUser);
    try {
      //This is to confirm the old password
      const loginPromise = await login(
        currentUser._delegate.email,
        oldPasswordRef.current.value
      );
      if (loginPromise) {
        if (newPasswordRef.current.value === confirmPasswordRef.current.value) {
          await ownUpdatePassword(
            currentUser,
            newPasswordRef.current.value
          ).then(setMessage("Password updated"));
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

  // function addBooking() {
  //   var bookingId = uuidv4();
  //   var testDate = new Date();
  //   const db = getDatabase();
  //   set(ref(db, "test/"), {
  //     bookingId: bookingId,
  //     startTime: "11:00",
  //     endTime: "12:00",
  //     office: "Behrn Tower",
  //     seat: "seat5",
  //     date: "2021-12-08",
  //     user: currentUser._delegate.uid,
  //   });
  // }

  return (
    <>
      <ProfileHeader>
        <h1>PROFILE</h1>
        <Tabs
          value={whatView}
          onChange={handleChangeView}
          aria-label="icon label tabs example"
        >
          <Tab
            icon={<AccountCircleIcon />}
            label="PROFILE INFO"
            sx={{ color: `${theme.palette.secondary.main}` }}
          />
          <Tab
            icon={<MenuBookIcon />}
            label="YOUR BOOKINGS"
            sx={{ color: `${theme.palette.secondary.main}` }}
          />
          <Tab
            icon={<MenuBookIcon />}
            label="UPDATE PASSWORD"
            sx={{ color: `${theme.palette.secondary.main}` }}
          />
        </Tabs>
      </ProfileHeader>

      <ProfileBody>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {whatView === 0 && (
          <ProfileInfo>
            <ProfileBodyHeaderText>Profile info</ProfileBodyHeaderText>
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
                                  key={j}
                                  className="d-flex justify-content-between"
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
          <div>
            <Form onSubmit={handlePasswordChange}>
              <Form.Group>
                <Form.Label>Old Password</Form.Label>
                <Form.Control ref={oldPasswordRef} type="password" required />
              </Form.Group>
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control ref={newPasswordRef} type="password" required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  ref={confirmPasswordRef}
                  type="password"
                  required
                />
              </Form.Group>
              <Button variant="contained" type="submit">
                Change Password
              </Button>
            </Form>
          </div>
        )}
        {/* <Button onClick={addBooking}>Add Booking</Button> */}
      </ProfileBody>
    </>
  );
}
