import React, { useState, useRef } from "react";
import { Form, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import {useAuth} from '../../../contexts/AuthContext'
import { useSelector } from "react-redux";
import { createBooking } from "../../../helper/HelperFunctions";

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
    createBooking(
      seatRef.current.value,
      dateRef.current.value,
      props.thisWeeksDatesStrings,
      currentUser,
      startTimeRef.current.value,
      endTimeRef.current.value,
      bookingsByOffice,
      props.selectedOffice,
      setError,
      setMessage
    );
  }

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      {/* <Button
        variant="contained"
        className="text-center mt-2 mb-2"
        id="formToggleBtn"
        disabled={loading}
        onClick={handleFormToggle}
      >
        {toggleButtonInnerHTML}
      </Button> */}
      {/* {showForm && (*/}
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
                  return <option key={i}>{seat.name}</option>;
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
            <Form.Control ref={endTimeRef} type="time" required></Form.Control>
          </Form.Group>
          <Button
            variant="contained"
            color="success"
            type="submit"
            className="mt-2"
          >
            Submit
          </Button>
        </Form>
      {/* // )} */}
    </div>
  );
}
