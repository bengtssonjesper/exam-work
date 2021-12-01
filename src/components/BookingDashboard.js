import React, { useRef, useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import SeatViewer from "./SeatViewer";
import SeatBooker from "./SeatBooker";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ref, getDatabase, onValue } from "firebase/database";
import { bookingsActions } from "../store/bookings";
import { reduxFormatData } from "./HelperFunctions";
import { useAuth } from "../contexts/AuthContext";

export default function BookingDashboard() {
  const { currentUser } = useAuth();
  const selectedOfficeRef = useRef("");
  const [selectedOffice, setSelectedOffice] = useState();
  const [showViewerAndBooker, setShowViewerAndBooker] = useState(false);
  const [thisWeeksDates, setThisWeeksDates] = useState([]);
  const [thisWeeksDatesStrings, setThisWeeksDatesStrings] = useState([]);
  const offices = useSelector((state) => state.bookings.offices);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getThisWeeksDates();
  }, []);

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

  function navigateToProfile() {
    navigate("/");
  }

  return (
    <>
    
      <Container className=" shadow-container min-height-full">
        <div>
          <Form className="mt-2">
            {/* <Form.Label>Office</Form.Label> */}
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
        {/* <Button className="mt-2 place-bottom" onClick={navigateToProfile}>
          Profile
        </Button> */}
        {/* <Button onClick={testAdd}>Add to db</Button> */}
      </Container>
    </>
  );
}
