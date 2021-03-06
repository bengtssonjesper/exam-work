import React, { useState, useRef } from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import BookingModal from "../../../components/BookingModal/BookingModal";
import { useSelector } from "react-redux";

export default function ScheduleBooking(props) {
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const darkMode = useSelector((state) => state.bookings.darkMode);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const myStyles = {
    height: "100%",
    backgroundColor: "rgb(225,225,225)",
    border: "1px solid rgba(170,170,170,0.2)",
    borderRadius: "3px",
    position: "absolute",
    overflow: "hidden",
    left: props.start,
    width: props.width,
    transition: "width 0.5s, left 0.5s",
  };

  const currentUserStyles = {
    backgroundColor: "rgb(216, 177, 203)",
    color: "black",
    cursor: "pointer",
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <strong> Start time:</strong> {props.booking.startTime}
        <br />
        <strong>End time:</strong> {props.booking.endTime}
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {show && (
        <BookingModal
          setShow={setShow}
          show={show}
          booking={props.booking}
          handleClose={handleClose}
        />
      )}
      <OverlayTrigger placement="right" overlay={popover}>
        {props && (
          <div
            ref={target}
            style={{
              ...myStyles,
              ...(props.isCurrentUsersBooking ? currentUserStyles : null),
            }}
            onClick={props.isCurrentUsersBooking ? handleShow : null}
            className="d-flex justify-content-between align-items-center"
          >
            <p
              style={{
                pointerEvents: "none",
                color: darkMode ? "black" : "black",
              }}
              className="m-1"
            >
              {props.booking.startTime}
            </p>
            <p
              style={{
                pointerEvents: "none",
                color: darkMode ? "black" : "black",
              }}
              className="m-1"
            >
              {props.booking.endTime}
            </p>
          </div>
        )}
      </OverlayTrigger>
    </>
  );
}
