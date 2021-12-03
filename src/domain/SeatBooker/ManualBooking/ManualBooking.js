import React, { useState, useRef } from "react";
import { Form, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import {useAuth} from '../../../contexts/AuthContext'
import { useSelector } from "react-redux";
import { createBooking } from "../../../helper/HelperFunctions";

export default function ManualBooking(props) {
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const dateRef = useRef();
  const seatRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const { currentUser } = useAuth();
  const bookingsByOffice = useSelector(
    (state) => state.bookings.bookingsByOffice
  );
  const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);


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
      <h3>Manual booking</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

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
    </div>
  );
}
