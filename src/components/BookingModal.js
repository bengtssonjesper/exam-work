import React, { useRef, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { set, ref, getDatabase } from "firebase/database";
import { updateBooking } from "./HelperFunctions";
import { useSelector } from "react-redux";

export default function BookingModal(props) {
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const bookingsByDate = useSelector((state) => state.bookings.bookingsByDate);

  function handleDeleteBooking() {
    props.setShow(false);
    const db = getDatabase();
    const removeRef = ref(
      db,
      "Offices/" +
        props.booking["office"] +
        "/bookings/" +
        props.booking["user"] +
        "/" +
        props.booking["bookingId"]
    );
    set(removeRef, {
      //Setting an empty object will delete the booking
    });
  }

  function handleUpdateBooking() {
    setShowUpdateForm(true);
  }

  function handleUpdateSubmit(e) {
    e.preventDefault();

    const bookingsOnSameSeat = bookingsByDate[props.booking["date"]].filter(
      (booking_) =>
        booking_["seat"] === props.booking["seat"] &&
        booking_["bookingId"] !== props.booking["bookingId"]
    );

    updateBooking(
      startTimeRef.current.value,
      endTimeRef.current.value,
      props.booking,
      bookingsOnSameSeat,
      setError,
      setMessage
    );
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>What do you wish to do with this booking?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showUpdateForm && (
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
              <Button className="mt-2 mb-2" type="submit">
                Update booking
              </Button>
            </Form>
          </div>
        )}
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={handleUpdateBooking}>
          Update booking
        </Button>
        <Button variant="danger" onClick={handleDeleteBooking}>
          Delete booking
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
