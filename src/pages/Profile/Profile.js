import React, { useState, useEffect } from "react";
import "../../styles/styles.css";
import { ref, getDatabase } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { onValue } from "@firebase/database";
import { useSelector, useDispatch } from "react-redux";
import {
  reduxFormatData,
  reduxFormatOffices,
  reduxFormatBookings,
  reduxFormatUsers,
} from "../../helper/HelperFunctions";
import {
  ProfileHeader,
  ProfileBody,
  ShowOnDesktop,
  ShowOnMobile,
} from "./styles";
import ProfileInfo from "../../domain/ProfileViews/ProfileInfo/ProfileInfo";
import ProfileBookings from "../../domain/ProfileViews/ProfileBookings/ProfileBookings";
import UpdatePassword from "../../domain/ProfileViews/UpdatePassword/UpdatePassword";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export default function Profile() {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [profileData, setProfileData] = useState();
  const [whatView, setWhatView] = useState(0);

  const dispatch = useDispatch();
  const offices = useSelector((state) => state.bookings.offices);
  const currentUsersBookings = useSelector(
    (state) => state.bookings.currentUsersBookings
  );
  const darkMode = useSelector((state) => state.bookings.darkMode);

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
    const reduxBookingsRef = ref(db, "bookings");
    if (offices.length === 0) {
      onValue(reduxBookingsRef, (snapshot) => {
        const data = snapshot.val();
        reduxFormatBookings(data, currentUser, dispatch);
      });
    }
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxAllOfficesRef = ref(db, "Offices");
    // if (offices.length === 0) {
    onValue(reduxAllOfficesRef, (snapshot) => {
      const data = snapshot.val();
      // reduxFormatData(data, currentUser, dispatch);
      reduxFormatOffices(data, dispatch);
    });
    // }
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxUsersRef = ref(db, "users");
    onValue(reduxUsersRef, (snapshot) => {
      const data = snapshot.val();
      reduxFormatUsers(data, dispatch);
    });
  }, []);

  const handleChangeView = (event, newValue) => {
    setWhatView(newValue);
  };

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

        {whatView === 0 && <ProfileInfo profileData={profileData} />}

        {whatView === 1 && <ProfileBookings />}
        {whatView === 2 && <UpdatePassword />}
      </ProfileBody>
    </>
  );
}
