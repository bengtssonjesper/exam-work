import React, { useState, useEffect } from "react";
import "./styles.css";
import { ref, getDatabase } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { Button, Alert, Container, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { onValue } from "@firebase/database";
import { useSelector, useDispatch } from "react-redux";
import bookings, { bookingsActions } from "../store/bookings";

export default function Profile() {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState();
  const today = new Date();

  const dispatch = useDispatch();
  const allBookings = useSelector((state) => state.bookings.allBookings);
  const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);
  const currentUsersBookings = useSelector(
    (state) => state.bookings.currentUsersBookings
  );
  const bookingsByDate = useSelector((state) => state.bookings.bookingsByDate);
  const bookingsByOffice = useSelector(
    (state) => state.bookings.bookingsByOffice
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
    onValue(reduxAllOfficesRef, (snapshot) => {
      const data = snapshot.val();
      reduxFormatData(data);
    });
  }, []);

  function reduxFormatData(data) {
    // const today = new Date();
    var allBookingsArr = [];
    var currentUsersBookingsByDateObj = {};
    var bookingsByDateObj = {};
    var bookingsByOfficeObj = {};
    var seatsByOffice = {};
    var offices = [];
    console.log("Redux format: ", data);
    for (const [officeName, officeObject] of Object.entries(data)) {
      offices.push(officeName);
      if ("seats" in officeObject) {
        seatsByOffice[officeName] = officeObject["seats"];
      }
      if ("bookings" in officeObject) {
        for (const [bookerId, bookingsObject] of Object.entries(
          officeObject.bookings
        )) {
          for (const [bookingId, booking] of Object.entries(bookingsObject)) {
            allBookingsArr.push(booking);
            //Här vill vi lägga till bokningarna på rätt ställe i objekten.
            //Kolla om det finns ett objekt för bokningens datum/office
            //Om det gör det, lägg den där, annars gör ett nytt objekt och lägg den där.

            if (booking.date in bookingsByDateObj) {
              bookingsByDateObj[booking.date].push(booking);
            } else {
              bookingsByDateObj[booking.date] = [booking];
            }

            if (booking.user === currentUser._delegate.uid) {
              var cmpDate = new Date();
              const year = booking.date.substr(0, 4);
              const month = booking.date.substr(5, 2);
              const date = booking.date.substr(8, 2);

              cmpDate.setFullYear(year, month - 1, date);
              cmpDate.setHours(23, 59, 59);

              if (cmpDate >= today) {
                if (booking.date in currentUsersBookingsByDateObj) {
                  currentUsersBookingsByDateObj[booking.date].push(booking);
                } else {
                  currentUsersBookingsByDateObj[booking.date] = [booking];
                }
              }
            }

            if (booking.office in bookingsByOfficeObj) {
              bookingsByOfficeObj[booking.office].push(booking);
            } else {
              bookingsByOfficeObj[booking.office] = [booking];
            }
          }
        }
      }
    }
    dispatch(bookingsActions.setAllBookings(allBookingsArr));
    dispatch(bookingsActions.setSeatsByOffice(seatsByOffice));
    dispatch(
      bookingsActions.setCurrentUsersBookings(currentUsersBookingsByDateObj)
    );
    dispatch(bookingsActions.setBookingsByDate(bookingsByDateObj));
    dispatch(bookingsActions.setBookingsByOffice(bookingsByOfficeObj));
    dispatch(bookingsActions.setOffices(offices));
  }

  function handleEditProfile() {
    navigate("/editprofile");
  }

  function testReduxContains() {
    console.log("Contains Allbookings: ", allBookings);
    console.log("Contains seats: ", seatsByOffice);
    console.log("Contains currentUsersBookings: ", currentUsersBookings);
    console.log("Contains bookingsbydate: ", bookingsByDate);
    console.log("Contains bookingsbyoffice: ", bookingsByOffice);
  }

  return (
    <>
      <Container className="mt-3" className="shadow-container min-height-full">
        {error && <Alert type="danger">{error}</Alert>}

        <h1 className="text-center">Profile</h1>
        {profileData && <p>Name: {profileData.name}</p>}
        {currentUser && <p>Logged in as: {currentUser.email}</p>}

        {currentUsersBookings && (
          <div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Show My Bookings</Accordion.Header>
                <Accordion.Body>
                  {/* {Object.keys(currentUsersBookings).map((element, i) => {
                    return (
                      <div key={i}>
                        <strong>{element}</strong>
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
                      </div>
                    );
                  })} */}
                  <Accordion>
                    {Object.keys(currentUsersBookings).map((element, i) => {
                      return (
                        <Accordion.Item eventKey={i}>
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
          </div>
        )}
        <Button className="mt-3" onClick={handleEditProfile}>
          Edit profile info
        </Button>
      </Container>
    </>
  );
}
