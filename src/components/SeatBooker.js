import React, { useState, useEffect, useRef } from "react";
import { getDatabase, set, ref, onValue } from "firebase/database";
import "./styles.css";
import { Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function SeatBooker(props) {
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [dbData, setDbData] = useState();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toggleButtonInnerHTML, setToggleButtonInnerHTML] =
    useState("Show Booker");
  const dateRef = useRef();
  const seatRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //Denna verkar köras väldigt mycket, kolla det
    getDbData();
  }, [props.selectedOffice]);

  function getDbData() {
    const db = getDatabase();
    const OfficesRef = ref(db, "Offices/" + props.selectedOffice);
    onValue(OfficesRef, (snapshot) => {
      const data = snapshot.val();
      setDbData(data);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (seatRef.current.value === "Select a seat") {
        throw "Please select a seat";
      }
      // else if(!(dateRef.current.value in props.thisWeeksDatesStrings)){
      else if (!props.thisWeeksDatesStrings.includes(dateRef.current.value)) {
        throw "You can only book one week ahead";
      } else if (isBookingAllowed()) {
        const db = getDatabase();
        const uid = uuidv4();
        try {
          set(
            ref(
              db,
              "Offices/" +
                props.selectedOffice +
                "/bookings/" +
                currentUser._delegate.uid +
                "/" +
                uid
            ),
            {
              user: currentUser._delegate.uid, //Förmodligen onödigt då det finns i överkategorin
              seat: seatRef.current.value,
              date: dateRef.current.value,
              startTime: startTimeRef.current.value,
              endTime: endTimeRef.current.value,
              office: props.selectedOffice,
              bookingId: uid,
            }
          );
          setMessage("Booking successful");
        } catch (error) {
          setError("Failed to post to database");
        }
      } else {
        throw "Booking not allowed, please change input data";
      }
    } catch (error) {
      setError(error);
    }
  }

  function isBookingAllowed() {
    var isAllowed = true;

    const dateStartTimeRef = new Date();
    const dateEndTimeRef = new Date();
    dateStartTimeRef.setHours(
      startTimeRef.current.value.substr(0, 2),
      startTimeRef.current.value.substr(3, 5),
      0
    );
    dateEndTimeRef.setHours(
      endTimeRef.current.value.substr(0, 2),
      endTimeRef.current.value.substr(3, 5),
      0
    );

    if (dateStartTimeRef >= dateEndTimeRef) {
      isAllowed = false;
      throw "Start time has to be before end time";
    } else if ("bookings" in dbData) {
      for (const [key, value] of Object.entries(dbData.bookings)) {
        for (const [childKey, childValue] of Object.entries(value)) {
          if (
            childValue.date === dateRef.current.value &&
            childValue.seat === seatRef.current.value &&
            isCollision(
              childValue.startTime,
              childValue.endTime,
              dateStartTimeRef,
              dateEndTimeRef
            )
          ) {
            isAllowed = false;
            throw "Booking collision with existing booking, please change input data";
          }
        }
      }
    } else {
      //If no bookings then automatically allowed
      isAllowed = true;
    }
    return isAllowed;
  }

  function isCollision(startTime, endTime, dateStartTimeRef, dateEndTimeRef) {
    var isCollision = false;
    const dateStartTime = new Date();
    const dateEndTime = new Date();

    dateStartTime.setHours(startTime.substr(0, 2), startTime.substr(3, 5), 0);
    dateEndTime.setHours(endTime.substr(0, 2), endTime.substr(3, 5), 0);
    if (
      (dateStartTimeRef >= dateStartTime && dateStartTimeRef <= dateEndTime) ||
      (dateEndTimeRef >= dateStartTime && dateEndTimeRef <= dateEndTime) ||
      dateStartTimeRef >= dateEndTimeRef
    ) {
      isCollision = true;
    }
    return isCollision;
  }

  function handleFormToggle() {
    setLoading(true);
    if (showForm) {
      setToggleButtonInnerHTML("Show Booker");
      setShowForm(false);
    } else {
      setToggleButtonInnerHTML("Hide Booker");
      setShowForm(true);
    }
    setLoading(false);
  }

  function navigateToProfile() {
    navigate("/");
  }

  return (
    <>
      <div className="shadow-container mt-3 p-2">
        <h1 className="text-center">Seat Booker</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Button
          className="text-center mt-2 mb-2"
          id="formToggleBtn"
          disabled={loading}
          onClick={handleFormToggle}
        >
          {toggleButtonInnerHTML}
        </Button>
        {showForm && (
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" ref={dateRef} required></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Seat</Form.Label>
              <Form.Control as="select" ref={seatRef} required>
                <option>Select a seat</option>
                {dbData &&
                  dbData.seats.map((seat, i) => {
                    return <option key={i}>{seat}</option>;
                  })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                ref={startTimeRef}
                type="time"
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                ref={endTimeRef}
                type="time"
                required
              ></Form.Control>
            </Form.Group>
            <Button type="submit" className="mt-2">
              Submit
            </Button>
          </Form>
        )}
      </div>
    </>
  );
}
