import React, { useEffect, useState, useRef } from "react";
import SeatRow from "./SeatRow";
import ScheduleRow from "./ScheduleRow";
import SeatRowHeadings from "./SeatRowHeadings";
import ScheduleHeadings from "./ScheduleHeadings";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function SeatViewer(props) {
  const [view, setView] = useState("text");
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
  const bookingsByOffice = useSelector(
    (state) => state.bookings.bookingsByOffice
  );
  const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);
  const allBookings = useSelector((state) => state.bookings.allBookings);

  //   useEffect(() => {
  //     //Declare function in useEffect to avoid warning about dependency array
  //     function getDbData() {
  //       const db = getDatabase();
  //       const OfficesRef = ref(db, "Offices/" + props.selectedOffice);
  //       onValue(OfficesRef, (snapshot) => {
  //         const data = snapshot.val();
  //         setDbData(data);
  //         handleDateChange(data);
  //       });
  //     }
  //     //Denna verkar köras väldigt mycket, kolla det
  //     getDbData();
  //   }, [props.selectedOffice]);

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

  // function getThisWeeksDates(){
  //     const today = new Date();
  //     var tmpArr=[];
  //     for(var i =0;i<7;i++){
  //         var tmp = new Date();
  //         tmp.setDate(today.getDate()+i)
  //         tmpArr.push(tmp)
  //     }
  //     setThisWeeksDates(tmpArr)
  // }

  //   function handleDateChange(data) {
  //     var tmpData = [];
  //     //To determine if called from onChange or from useEffect
  //     if ("seats" in data) {
  //       tmpData = data;
  //     } else {
  //       tmpData = dbData;
  //     }
  //     var tmpArr = [];
  //     if ("bookings" in tmpData) {
  //       for (const [key, value] of Object.entries(tmpData.bookings)) {
  //         for (const [childKey, childValue] of Object.entries(value)) {
  //           //Här ges erroret, dateref.current är null,
  //           if (dateRef && childValue.date === dateRef.current.value) {
  //             tmpArr.push(childValue);
  //           }
  //         }
  //       }
  //     }
  //     console.log("DaysortedData: ", tmpArr);
  //     setDaySortedData(tmpArr);
  //   }

  useEffect(() => {
    handleDateChange();
  }, [allBookings]);

  function handleDateChange() {
    //Denna funktion ska returnera en array av alla bokningar på det valda officet och datumet
    var tmpArr = [];
    const data = bookingsByOffice[props.selectedOffice];
    if (dateRef !== null && dateRef.current.value !== "Select a date") {
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

  return (
    <div className="shadow-container">
      <h1 className="text-center">Seat Viewer</h1>
      <Row className="mt-2 mb-4">
        <Col className="d-flex align-items-end md-6">
          <Form>
            <Form.Group>
              <Form.Label>Seat</Form.Label>
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
          </Form>
        </Col>
        <Col className="d-flex justify-content-evenly align-items-end">
          <Button
            id="setTextViewBtn"
            variant={view === "text" ? "dark" : "outline-dark"}
            onClick={handleTextViewClick}
          >
            Text View
          </Button>
          <Button
            id="setScheduleViewBtn"
            variant={view === "schedule" ? "dark" : "outline-dark"}
            onClick={handleScheduleViewClick}
          >
            Schedule View
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs md="3" className="mt-3 mb-3">
          {view === "schedule" && (
            <Button disabled={loading} onClick={swapShowTimeChange}>
              Change View Times
            </Button>
          )}
          {view === "schedule" && showTimeChange && (
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
              <Button type="submit">Change</Button>
            </Form>
          )}
        </Col>
      </Row>

      {view === "text" && dateRef.current.value !== "Select a date" && (
        <SeatRowHeadings />
      )}
      {/* {view === "text" && (
        <div>
          {dateRef.current.value !== "Select a date" &&
            dbData &&
            daySortedData &&
            dbData.seats.map((seat, i) => {
              return (
                <SeatRow
                  key={i}
                  seat={seat}
                  bookings={daySortedData
                    .filter((booking) => booking.seat === seat)
                    .sort(sortBookings)}
                />
              );
            })}
        </div>
      )} */}
      {view === "text" && (
        <div>
          {dateRef.current.value !== "Select a date" &&
            daySortedData &&
            seatsByOffice[props.selectedOffice].map((seat, i) => {
              return (
                <SeatRow
                  key={i}
                  seat={seat}
                  bookings={daySortedData
                    .filter((booking) => booking.seat === seat)
                    .sort(sortBookings)}
                />
              );
            })}
        </div>
      )}

      {view === "schedule" && (
        <div style={{ margin: "5px" }}>
          {dateRef && dateRef.current.value !== "Select a date" && (
            <ScheduleHeadings workHoursArray={workHoursArray} />
          )}
          {/* {scheduleStartTime &&
            dateRef.current.value !== "Select a date" &&
            dbData &&
            daySortedData &&
            dbData.seats.map((seat, i) => {
              return (
                <div>
                  <ScheduleRow
                    key={i}
                    start={scheduleStartTime}
                    end={scheduleEndTime}
                    seat={seat}
                    bookings={daySortedData
                      .filter((booking) => booking.seat === seat)
                      .sort(sortBookings)}
                  />
                </div>
              );
            })} */}
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
                    seat={seat}
                    bookings={daySortedData
                      .filter((booking) => booking.seat === seat)
                      .sort(sortBookings)}
                  />
                </div>
              );
            })}
        </div>
      )}
      {dateRef && dateRef.current.value !== "Select a date" && (
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
