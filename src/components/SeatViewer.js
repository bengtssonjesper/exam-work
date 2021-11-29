import React, { useEffect, useState, useRef } from "react";
import SeatRow from "./SeatRow";
import ScheduleRow from "./ScheduleRow";
import SeatRowHeadings from "./SeatRowHeadings";
import ScheduleHeadings from "./ScheduleHeadings";
import GraphicView from "./GraphicView";
import { Form, Row, Col, Container } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { bookingsActions } from "../store/bookings";

export default function SeatViewer(props) {
  const [view, setView] = useState("");
  // const [thisWeeksDates,setThisWeeksDates]=useState([])
  const [daySortedData, setDaySortedData] = useState();
  const [dayHours, setDayHours] = useState([]);
  const [showTimeChange, setShowTimeChange] = useState(false);
  const [scheduleStartTime, setScheduleStartTime] = useState("06");
  const [scheduleEndTime, setScheduleEndTime] = useState("18");
  const [workHoursArray, setWorkHoursArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const dateRef = useRef("");
  const startScheduleRef = useRef("");
  const endScheduleRef = useRef("");
  const viewRef = useRef("");
  const bookingsByOffice = useSelector(
    (state) => state.bookings.bookingsByOffice
  );
  const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);
  const allBookings = useSelector((state) => state.bookings.allBookings);
  const dispatch = useDispatch();
  const views = ["Text", "Schedule", "Graphic"];

  useEffect(() => {
    // getThisWeeksDates();
    setDayHours(getTimeArray(0, 24));
    setWorkHoursArray(getTimeArray(scheduleStartTime, scheduleEndTime));
  }, [scheduleStartTime, scheduleEndTime]);

  function getTimeArray(start, end) {
    var tmpArr = [];
    for (var i = start; i <= end; i++) {
      var tmpString = i.toString();
      if (tmpString.length < 2) {
        tmpArr.push("0" + tmpString);
      } else {
        tmpArr.push(tmpString);
      }
    }
    return tmpArr;
  }

  useEffect(() => {
    handleDateChange();
  }, [props.selectedOffice, allBookings]);

  // useEffect(() => {
  //   handleDateChange();
  // }, [allBookings, props.selectedOffice]);

  function handleDateChange() {
    //Denna funktion ska returnera en array av alla bokningar på det valda officet och datumet
    var tmpArr = [];
    const data = bookingsByOffice[props.selectedOffice];
    if (data && dateRef !== null && dateRef.current.value !== "Select a date") {
      console.log("dispatch: ", dateRef.current.value);
      dispatch(bookingsActions.setViewDate(dateRef.current.value));
      data.forEach((booking) => {
        if (booking.date === dateRef.current.value) {
          tmpArr.push(booking);
        }
      });
    }
    setDaySortedData(tmpArr);
  }

  function sortBookings(a, b) {
    var timeA = new Date();
    var timeB = new Date();
    timeA.setHours(a.startTime.substr(0, 2));
    timeA.setMinutes(a.startTime.substr(3, 5));
    timeB.setHours(b.startTime.substr(0, 2));
    timeB.setMinutes(b.startTime.substr(3, 5));
    return timeA - timeB;
  }

  function handleTextViewClick() {
    setView("text");
  }

  function handleScheduleViewClick() {
    setView("schedule");
  }
  function handleGraphicViewClick() {
    setView("graphic");
  }

  function swapShowTimeChange() {
    setLoading(true);
    if (showTimeChange) {
      setShowTimeChange(false);
    } else {
      setShowTimeChange(true);
    }
    setLoading(false);
  }

  function handleTimeChange(e) {
    e.preventDefault();
    setScheduleStartTime(startScheduleRef.current.value);
    setScheduleEndTime(endScheduleRef.current.value);

    setWorkHoursArray(
      getTimeArray(startScheduleRef.current.value, endScheduleRef.current.value)
    );
  }

  function handleViewChange() {
    console.log("Setting view to: ", viewRef.current.value);
    setView(viewRef.current.value);
  }

  return (
    <div className="shadow-container">
      <h1 className="text-center">Seat Viewer</h1>
      <Row className="mt-2 mb-4">
        <Col sm lg="3" className="d-flex align-items-end md-6">
          <Form>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Select
                aria-label="Default select example"
                ref={dateRef}
                onChange={handleDateChange}
              >
                <option>Select a date</option>
                {props.thisWeeksDates &&
                  props.thisWeeksDates.map((date, i) => {
                    return (
                      <option key={i}>
                        {date.getFullYear()}-{date.getMonth() + 1}-
                        {date.getDate()}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>
            {dateRef && dateRef.current.value !== "Select a date" && (
              <Form.Group>
                <Form.Label>Select view</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  ref={viewRef}
                  onChange={handleViewChange}
                >
                  <option>Select a view</option>
                  {views.map((view, i) => {
                    return <option key={i}>{view}</option>;
                  })}
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Col>
        {/* <Col className="d-flex mt-3 justify-content-evenly align-items-end">
          <Col xs="6">
          <Button
            id="setTextViewBtn"
            variant={view === "text" ? "dark" : "outline-dark"}
            onClick={handleTextViewClick}
          >
            Text View
          </Button>
          </Col>
          <Col xs="6">
          <Button
            id="setScheduleViewBtn"
            variant={view === "schedule" ? "dark" : "outline-dark"}
            onClick={handleScheduleViewClick}
          >
            Schedule View
          </Button>
          <Button
            id="setTextViewBtn"
            variant={view === "graphic" ? "dark" : "outline-dark"}
            onClick={handleGraphicViewClick}
          >
            Graphic View
          </Button>
          </Col>
        </Col> */}
      </Row>
      <Row>
        <Col xs md="3" className="mt-3 mb-3">
          {view === "Schedule" && (
            <Button
              variant="contained"
              disabled={loading}
              onClick={swapShowTimeChange}
            >
              Change View Times
            </Button>
          )}
          {view === "Schedule" && showTimeChange && (
            <Form onSubmit={handleTimeChange}>
              <Form.Group>
                <Form.Label>View Hours:</Form.Label>
                <Form.Select
                  ref={startScheduleRef}
                  aria-label="Default select example"
                >
                  {dayHours &&
                    dayHours.map((hour) => {
                      return <option>{hour}</option>;
                    })}
                </Form.Select>
                <Form.Select
                  ref={endScheduleRef}
                  aria-label="Default select example"
                >
                  {dayHours &&
                    dayHours.map((hour) => {
                      return <option>{hour}</option>;
                    })}
                </Form.Select>
              </Form.Group>
              <Button variant="contained" type="submit">
                Change
              </Button>
            </Form>
          )}
        </Col>
      </Row>

      {view === "Graphic" && <GraphicView />}

      {view === "Text" && dateRef.current.value !== "Select a date" && (
        <SeatRowHeadings />
      )}
      {view === "Text" && (
        <div>
          {dateRef.current.value !== "Select a date" &&
            daySortedData &&
            seatsByOffice[props.selectedOffice].map((seat, i) => {
              return (
                <SeatRow
                  key={i}
                  seat={seat.name}
                  bookings={daySortedData
                    .filter((booking) => booking.seat === seat.name)
                    .sort(sortBookings)}
                />
              );
            })}
        </div>
      )}

      {view === "Schedule" && (
        <div style={{ margin: "5px" }}>
          {dateRef && dateRef.current.value !== "Select a date" && (
            <ScheduleHeadings workHoursArray={workHoursArray} />
          )}

          {scheduleStartTime &&
            dateRef.current.value !== "Select a date" &&
            daySortedData &&
            seatsByOffice[props.selectedOffice].map((seat, i) => {
              return (
                <div>
                  <ScheduleRow
                    key={i}
                    start={scheduleStartTime}
                    end={scheduleEndTime}
                    seat={seat.name}
                    bookings={daySortedData
                      .filter((booking) => booking.seat === seat.name)
                      .sort(sortBookings)}
                  />
                </div>
              );
            })}
        </div>
      )}
      {(view === "Text" || view === "Schedule") &&
        dateRef &&
        dateRef.current.value !== "Select a date" && (
          <Container>
            <div className="whosBookingsWrapper">
              Your bookings: <div className="cube ownCube" />
            </div>
            <div className="whosBookingsWrapper">
              Other bookings: <div className="cube othersCube" />
            </div>
          </Container>
        )}
    </div>
  );
}
