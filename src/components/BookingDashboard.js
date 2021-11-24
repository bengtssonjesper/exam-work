import React, { useRef, useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import SeatViewer from "./SeatViewer";
import SeatBooker from "./SeatBooker";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function BookingDashboard() {
  const selectedOfficeRef = useRef("");
  const [selectedOffice, setSelectedOffice] = useState();
  const [showViewerAndBooker, setShowViewerAndBooker] = useState(false);
  const [thisWeeksDates, setThisWeeksDates] = useState([]);
  const [thisWeeksDatesStrings, setThisWeeksDatesStrings] = useState([]);
  const offices = useSelector((state) => state.bookings.offices);
  const navigate = useNavigate();

  useEffect(() => {
    getThisWeeksDates();
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
      const day = date.getDate().toString();
      var tmpStr = year + "-" + month + "-" + day;
      return tmpStr;
    });
    setThisWeeksDatesStrings(tmpArr);
  }

  function handleOnChange() {
    //Using selectedOffice as state to force rerender of childs on update
    setSelectedOffice(selectedOfficeRef.current.value);
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
      <Container className="shadow-container min-height-full">
        <div>
          <Form>
            <Form.Label>Office</Form.Label>
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
      </Container>
    </>
  );
}
