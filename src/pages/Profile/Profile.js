import React, { useState, useEffect } from "react";
import {MainContainer} from '../../styles/styles'
import '../../styles/styles.css'
import { ref, getDatabase } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, Container, Accordion } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { onValue } from "@firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { reduxFormatData } from "../../helper/HelperFunctions";
import { 
  ProfileHeader,
  ProfileBody,
  ProfileInfo,
  ProfileBookings,
  ProfileBodyHeaderText, 
  AccordionStyles, 
  EditProfileButtonStyles } from "./styles";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { theme } from "../../styles/theme";

export default function Profile() {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState();
  const [whatView, setWhatView] = useState(0);

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


  return (
    <>
      <ProfileHeader>
        <h1>PROFILE</h1>
        <Tabs value={whatView} onChange={handleChangeView} aria-label="icon label tabs example"  >
          <Tab icon={<AccountCircleIcon />} label="PROFILE INFO" sx={{color:`${theme.palette.secondary.main}`}} />
          <Tab icon={<MenuBookIcon />} label="YOUR BOOKINGS" sx={{color:`${theme.palette.secondary.main}`}} />
        </Tabs>
      </ProfileHeader>

      <ProfileBody>
        {whatView===0 &&
         <ProfileInfo>
           <ProfileBodyHeaderText>Profile info</ProfileBodyHeaderText>
           {profileData&&
           ('name' in profileData) &&
           <p>Name: {profileData.name}</p>
           
          }
          <Button
          variant="contained"
          style={EditProfileButtonStyles}
          color="secondary"
          onClick={handleEditProfile}
        >
          EDIT PROFILE INFO
        </Button>
         </ProfileInfo>
         }

        {whatView===1 &&
        <ProfileBookings>
          <ProfileBodyHeaderText>Expand the accordion below to view your bookings</ProfileBodyHeaderText>
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
          </ProfileBookings>}
      </ProfileBody>
    </>
  );
}
