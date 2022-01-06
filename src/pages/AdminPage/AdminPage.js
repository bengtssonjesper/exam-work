import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { ref, set, getDatabase, onValue } from "firebase/database";
import { theme } from "../../styles/theme";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { AdminHeader, AdminBody } from "./styles";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import HandleBookings from "../../domain/AdminViews/HandleBookings/HandleBookings";
import HandleSeats from "../../domain/AdminViews/HandleSeats/HandleSeats";
import HandleOffices from "../../domain/AdminViews/HandleOffices/HandleOffices";
import HandleUsers from "../../domain/AdminViews/HandleUsers/HandleUsers";
import {
  reduxFormatBookings,
  reduxFormatOffices,
  reduxFormatUsers,
} from "../../helper/HelperFunctions";
import Typography from "@mui/material/Typography";

import { ShowOnMobile, ShowOnDesktop } from "./styles";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function AdminPage() {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dbData, setDbData] = useState([]);
  const [whatView, setWhatView] = useState("handleOffices");
  const adminUidRef = useRef();
  const newOfficeRef = useRef();
  const offices = useSelector((state) => state.bookings.offices);
  const allBookings = useSelector((state) => state.bookings.allBookings);
  const bookingsByOffice = useSelector(
    (state) => state.bookings.bookingsByOffice
  );
  const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);
  const darkMode = useSelector((state) => state.bookings.darkMode);

  useEffect(() => {
    //Förmdoligen bättre att köra detta när man klickar med clean database
    //Får dock problem med asynd/await
    getDbData();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxBookingsRef = ref(db, "bookings");
    if (allBookings.length === 0) {
      onValue(reduxBookingsRef, (snapshot) => {
        const data = snapshot.val();
        reduxFormatBookings(data, currentUser, dispatch);
      });
    }
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxOfficesRef = ref(db, "offices");
    if (offices.length === 0) {
      onValue(reduxOfficesRef, (snapshot) => {
        const data = snapshot.val();
        reduxFormatOffices(data, dispatch);
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

  function getDbData() {
    const db = getDatabase();
    const dbRef = ref(db, "Offices");
    onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        setDbData(data);
      },
      {
        onlyOnce: true,
      }
    );
  }

  function handleDatabaseClean() {
    //Hämta hem alla bokningar, loopa igenom och ta bort dem som har datum tidigare än idag.
    const today = new Date();
    const db = getDatabase();

    for (const [key, officeObject] of Object.entries(dbData)) {
      if ("bookings" in officeObject) {
        for (const [bookerId, bookingsArr] of Object.entries(
          officeObject["bookings"]
        )) {
          for (const [bookingId, booking] of Object.entries(bookingsArr)) {
            const year = booking.date.substr(0, 4);
            const month = parseInt(booking.date.substr(5, 2)) - 1;
            const date = booking.date.substr(8, 2);
            const cmpDate = new Date(year, month, date);
            cmpDate.setHours(23, 59, 59);
            if (cmpDate < today) {
              const removeRef = ref(
                db,
                "Offices/" + key + "/bookings/" + bookerId + "/" + bookingId
              );
              set(removeRef, {
                //Setting to an empty object will delete the booking
              });
            }
          }
        }
      }
    }
  }

  function handleAddAdmin(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    const db = getDatabase();
    set(ref(db, "Admins/" + adminUidRef.current.value), {
      uid: adminUidRef.current.value,
    })
      .then(() => {
        setMessage("Admin added");
      })
      .catch((error) => {
        setError(error["code"]);
      });
  }

  const handleChangeView = (event, newValue) => {
    setWhatView(newValue);
  };

  function handleAddOffice(e) {
    e.preventDefault();
    const db = getDatabase();
    set(ref(db, "offices/" + newOfficeRef.current.value), {
      seats: ["seat1"],
    })
      .then(() => {
        setMessage("Office added");
      })
      .catch((error) => {
        setError(error["code"]);
      });
  }

  return (
    <>
      <AdminHeader
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
          ADMIN PAGE
        </Typography>
        <ShowOnDesktop>
          <Tabs
            value={whatView}
            onChange={handleChangeView}
            aria-label="icon label tabs example"
          >
            <Tab
              value="handleOffices"
              label="HANDLE OFFICES"
              // sx={{ color: `${theme.palette.secondary.main}` }}
            />
            <Tab
              value="handleSeats"
              label="HANDLE SEATS"
              // sx={{ color: `${theme.palette.secondary.main}` }}
            />
            <Tab
              value="handleBookings"
              label="HANDLE BOOKINGS"
              // sx={{ color: `${theme.palette.secondary.main}` }}
            />
            <Tab
              value="handleUsers"
              label="ADD USER"
              // sx={{ color: `${theme.palette.secondary.main}` }}
            />
            <Tab
              value="addAdmin"
              label="ADD ADMIN"
              // sx={{ color: `${theme.palette.secondary.main}` }}
            />
          </Tabs>
        </ShowOnDesktop>
        <ShowOnMobile>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Select
            </InputLabel>
            <Select
              onChange={(e) => {
                setWhatView(e.target.value);
              }}
              defaultValue={"handleOffices"}
            >
              <MenuItem value={"handleOffices"}>HANDLE OFFICES</MenuItem>
              <MenuItem value={"handleSeats"}>HANDLE SEATS</MenuItem>
              <MenuItem value={"handleBookings"}>HANDLE BOOKINGS</MenuItem>
              <MenuItem value={"handleUsers"}>HANDLE USERS</MenuItem>
              <MenuItem value={"addAdmin"}>ADD ADMIN</MenuItem>
            </Select>
          </FormControl>
        </ShowOnMobile>
      </AdminHeader>

      <AdminBody>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {whatView === "addAdmin" && (
          <Card raised style={{ width: "min(400px,95%)", margin: "auto" }}>
            <CardContent>
              <Form onSubmit={handleAddAdmin}>
                <Form.Group>
                  <Form.Label>Admin UID</Form.Label>
                  <Form.Control type="text" ref={adminUidRef} />
                </Form.Group>
                <Button type="submit">Add admin</Button>
              </Form>
            </CardContent>
          </Card>
        )}

        {whatView === "handleBookings" && allBookings && (
          <HandleBookings bookings={allBookings} />
        )}
        {whatView === "handleUsers" && allBookings && (
          <HandleUsers bookings={allBookings} />
        )}
        {whatView === "handleOffices" && offices && (
          <HandleOffices
            offices={offices}
            bookingsByOffice={bookingsByOffice}
          />
        )}
        {whatView === "handleSeats" && offices && (
          <HandleSeats
            offices={offices}
            seatsByOffice={seatsByOffice}
            bookingsByOffice={bookingsByOffice}
          />
        )}
      </AdminBody>
    </>
  );
}
