import React, {useState, useRef} from 'react'
import {Button, Form, Alert} from 'react-bootstrap'
import {v4 as uuidv4} from 'uuid'
import {set,ref,getDatabase} from 'firebase/database'
import { useAuth } from "../contexts/AuthContext";
import { useSelector } from "react-redux";

export default function ManualBooking(props) {
    const [error, setError] = useState();
    const [message, setMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [toggleButtonInnerHTML, setToggleButtonInnerHTML] =
    useState("Show Booker");
    const dateRef = useRef();
    const seatRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    const { currentUser } = useAuth();
    const bookingsByOffice = useSelector(
        (state) => state.bookings.bookingsByOffice
      );
      const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);

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

      function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
          if (seatRef.current.value === "Select a seat") {
            throw "Please select a seat";
          } else if (!props.thisWeeksDatesStrings.includes(dateRef.current.value)) {
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
                  user: currentUser._delegate.uid,
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
        var compareBookingsArr = bookingsByOffice[props.selectedOffice];
        compareBookingsArr = compareBookingsArr.filter(
          (booking) =>
            booking.date === dateRef.current.value &&
            booking.seat === seatRef.current.value
        );
    
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
        } else {
          compareBookingsArr.forEach((booking) => {
            if (
              isCollision(
                booking.startTime,
                booking.endTime,
                dateStartTimeRef,
                dateEndTimeRef
              )
            ) {
              isAllowed = false;
              throw "Collision with existing booking, please change input data";
            }
          });
    
          return isAllowed;
        }
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

    return (
        <div>
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
                  {seatsByOffice &&
                    seatsByOffice[props.selectedOffice].map((seat, i) => {
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
    )
}
