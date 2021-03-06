import React, { useRef, useState } from "react";
import { Modal, Form, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { set, ref, getDatabase } from "firebase/database";
import { updateBooking } from "../../helper/HelperFunctions";
import { useSelector } from "react-redux";

export default function BookingModal(props) {
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const bookingsByDate = useSelector((state) => state.bookings.bookingsByDate);
  const currentUsersBookings = useSelector(
    (state) => state.bookings.currentUsersBookings
  );

  function handleDeleteBooking() {
    props.setShow(false);
    const db = getDatabase();
    const removeRef = ref(
      db,
      "bookings/" + props.booking.user + "/" + props.booking.bookingId
    );
    set(removeRef, {
      //Setting an empty object will delete the booking
    });
  }

  function handleUpdateSubmit(e) {
    e.preventDefault();

    const bookingsOnSameSeat = bookingsByDate[props.booking["date"]].filter(
      (booking_) =>
        booking_["seat"] === props.booking["seat"] &&
        booking_["bookingId"] !== props.booking["bookingId"]
    );

    if (props.fromAdminModal !== null) {
      updateBooking(
        startTimeRef.current.value,
        endTimeRef.current.value,
        props.booking,
        bookingsOnSameSeat,
        setError,
        setMessage,
        currentUsersBookings,
        props.fromAdminModal
      );
    } else {
      updateBooking(
        startTimeRef.current.value,
        endTimeRef.current.value,
        props.booking,
        bookingsOnSameSeat,
        setError,
        setMessage,
        currentUsersBookings
      );
    }

    // updateBooking(
    //   startTimeRef.current.value,
    //   endTimeRef.current.value,
    //   props.booking,
    //   bookingsOnSameSeat,
    //   setError,
    //   setMessage,
    //   currentUsersBookings,

    // );
  }

  return (
    <Modal
      style={{ color: "black" }}
      show={props.show}
      onHide={props.handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Update or delete booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>Please enter the new times</p>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group>
              <Form.Label>Start Time:</Form.Label>
              <Form.Control
                ref={startTimeRef}
                type="time"
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>End Time:</Form.Label>
              <Form.Control
                ref={endTimeRef}
                type="time"
                required
              ></Form.Control>
            </Form.Group>
            <Button
              color="success"
              variant="contained"
              className="mt-2 mb-2"
              type="submit"
            >
              Update
            </Button>
          </Form>
        </div>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ margin: "5px" }}
          color="error"
          variant="contained"
          onClick={handleDeleteBooking}
        >
          Delete booking
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
