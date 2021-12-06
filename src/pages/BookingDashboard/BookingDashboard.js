import React, { useRef, useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import SeatViewer from "../../domain/SeatViewer/SeatViewer";
// import SeatBooker from "./SeatBooker";
import SeatBooker from "../../domain/SeatBooker/SeatBooker";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ref, getDatabase, onValue } from "firebase/database";
import { bookingsActions } from "../../store/bookings";
// import { reduxFormatData } from "../../helper/HelperFunctions";
import {
  reduxFormatOffices,
  reduxFormatBookings,
} from "../../helper/HelperFunctions";
import { useAuth } from "../../contexts/AuthContext";
import {
  DashboardHeader,
  DashboardHeaderRow,
  DashboardHeaderItem,
  DashboardBody,
  ViewerBookerContainer,
  ChangeOfficePicker,
} from "./styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import { theme } from "../../styles/theme";

export default function BookingDashboard() {
  const { currentUser } = useAuth();
  const selectedOfficeRef = useRef("");
  const [selectedOffice, setSelectedOffice] = useState();
  const [showViewerAndBooker, setShowViewerAndBooker] = useState(false);
  const [thisWeeksDates, setThisWeeksDates] = useState([]);
  const [thisWeeksDatesStrings, setThisWeeksDatesStrings] = useState([]);
  const [whatViewer, setWhatViewer] = useState("schedule");
  const [whatBooker, setWhatBooker] = useState("manual");
  const offices = useSelector((state) => state.bookings.offices);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getThisWeeksDates();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxBookingsRef = ref(db, "bookings");
    // if (offices.length === 0) {
    onValue(reduxBookingsRef, (snapshot) => {
      const data = snapshot.val();
      reduxFormatBookings(data, currentUser, dispatch);
    });
    // }
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxOfficesRef = ref(db, "offices");
    // if (offices.length === 0) {
    onValue(reduxOfficesRef, (snapshot) => {
      const data = snapshot.val();
      reduxFormatOffices(data, dispatch);
    });
    // }
  }, []);

  function getThisWeeksDates() {
    const today = new Date();
    var tmpArr = [];
    for (var i = 0; i < 7; i++) {
      var tmp = new Date();
      tmp.setDate(today.getDate() + i);
      tmpArr.push(tmp);
    }
    setThisWeeksDates(tmpArr);
    formatThisWeeksDates(tmpArr);
  }

  function formatThisWeeksDates(arr) {
    var tmpArr = [];
    tmpArr = arr.map((date) => {
      const year = date.getFullYear().toString();
      const month =
        date.getMonth().toString() === "12"
          ? "1"
          : (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (day.length < 2) {
        day = "0" + day;
      }

      var tmpStr = year + "-" + month + "-" + day;
      return tmpStr;
    });
    setThisWeeksDatesStrings(tmpArr);
  }

  function handleOnChange() {
    //Using selectedOffice as state to force rerender of childs on update
    setSelectedOffice(selectedOfficeRef.current.value);
    dispatch(
      bookingsActions.setSelectedOffice(selectedOfficeRef.current.value)
    );
    if (selectedOfficeRef.current.value === "Select an office") {
      setShowViewerAndBooker(false);
    } else {
      setShowViewerAndBooker(true);
    }
  }

  const handleChangeViewer = (event, newValue) => {
    setWhatViewer(newValue);
  };
  const handleChangeBooker = (event, newValue) => {
    setWhatBooker(newValue);
  };

  return (
    <>
      <DashboardHeader>
        <DashboardHeaderItem>{/* <h1>Some header</h1> */}</DashboardHeaderItem>
        <DashboardHeaderRow>
          <DashboardHeaderItem>
            <h3>Viewing option</h3>
            <Divider />
            <Tabs
              value={whatViewer}
              onChange={handleChangeViewer}
              aria-label="primary tabs example"
            >
              <Tab
                value="text"
                label="Text"
                sx={{ color: `${theme.palette.secondary.main}` }}
              />
              <Tab
                value="schedule"
                label="Schedule"
                sx={{ color: `${theme.palette.secondary.main}` }}
              />
            </Tabs>
          </DashboardHeaderItem>
          <Divider orientation="vertical" variant="middle" />
          <DashboardHeaderItem>
            <h3>Booking option</h3>
            <Divider />
            <Tabs
              value={whatBooker}
              onChange={handleChangeBooker}
              aria-label="icon label tabs example"
            >
              <Tab
                value="manual"
                label="Manual"
                sx={{ color: `${theme.palette.secondary.main}` }}
              />
              <Tab
                value="automatic"
                label="Automatic"
                sx={{ color: `${theme.palette.secondary.main}` }}
              />
            </Tabs>
          </DashboardHeaderItem>
        </DashboardHeaderRow>
      </DashboardHeader>
      <DashboardBody>
        <div style={ChangeOfficePicker}>
          <Form className="mt-2">
            <Form.Select
              aria-label="Default select example"
              onChange={handleOnChange}
              ref={selectedOfficeRef}
            >
              <option>Select an office</option>
              {offices &&
                offices.map((office, i) => {
                  return <option key={i}>{office}</option>;
                })}
            </Form.Select>
          </Form>
        </div>
        {showViewerAndBooker && (
          <ViewerBookerContainer>
            <SeatViewer
              selectedOffice={selectedOffice}
              thisWeeksDates={thisWeeksDates}
              thisWeeksDatesStrings={thisWeeksDatesStrings}
              viewer={whatViewer}
            />
            <div className="vr" />
            <SeatBooker
              selectedOffice={selectedOffice}
              thisWeeksDates={thisWeeksDates}
              thisWeeksDatesStrings={thisWeeksDatesStrings}
              booker={whatBooker}
            />
          </ViewerBookerContainer>
        )}
      </DashboardBody>
      {/* <Container className=" shadow-container min-height-full">
        <div>
          <Form className="mt-2">
            <Form.Select
              aria-label="Default select example"
              onChange={handleOnChange}
              ref={selectedOfficeRef}
            >
              <option>Select an office</option>
              {offices &&
                offices.map((office, i) => {
                  return <option key={i}>{office}</option>;
                })}
            </Form.Select>
          </Form>
        </div>
        {showViewerAndBooker && (
          <div>
            <div id="seatViewer">
              <SeatViewer
                selectedOffice={selectedOffice}
                thisWeeksDates={thisWeeksDates}
                thisWeeksDatesStrings={thisWeeksDatesStrings}
              ></SeatViewer>
            </div>
            <div id="seatBooker">
              <SeatBooker
                selectedOffice={selectedOffice}
                thisWeeksDates={thisWeeksDates}
                thisWeeksDatesStrings={thisWeeksDatesStrings}
              ></SeatBooker>
            </div>
          </div>
        )}
      </Container> */}
    </>
  );
}
