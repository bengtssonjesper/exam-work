import React from "react";
import { Row, Col } from "react-bootstrap";
import ScheduleBooking from "./ScheduleBooking";
import { useAuth } from "../../../contexts/AuthContext";
import { ScheduleRowContainer } from "./styles";
import { useSelector } from "react-redux";

export default function ScheduleRow(props) {
  const darkMode = useSelector((state) => state.bookings.darkMode);
  const { currentUser } = useAuth();

  const firstHour = props.start;
  const lastHour = props.end;

  function calculateStart(booking) {
    const amountMinutes = (lastHour - firstHour) * 60;
    const bookingStartMinutes =
      parseInt(booking.startTime.substr(0, 2)) * 60 +
      parseInt(booking.startTime.substr(3, 5));
    const startRatio = (bookingStartMinutes - firstHour * 60) / amountMinutes;
    const startString = startRatio * 100 + "%";
    return startString;
  }

  function calculateWidth(booking) {
    const amountWorkMinutes = (lastHour - firstHour) * 60;
    const bookingStartMinutes =
      parseInt(booking.startTime.substr(0, 2)) * 60 +
      parseInt(booking.startTime.substr(3, 5));
    const bookingEndMinutes =
      parseInt(booking.endTime.substr(0, 2)) * 60 +
      parseInt(booking.endTime.substr(3, 5));
    const amountBookingMinutes = bookingEndMinutes - bookingStartMinutes;

    const bookingWidthRatio = amountBookingMinutes / amountWorkMinutes;

    const widthString = bookingWidthRatio * 100 + "%";

    return widthString;
  }

  function getIsCurrentUsersBooking(booking) {
    var isCurrentUsersBooking = false;
    if (currentUser._delegate.uid === booking.user) {
      isCurrentUsersBooking = true;
    }
    return isCurrentUsersBooking;
  }

  return (
    <ScheduleRowContainer
      styles={{ borderColor: darkMode ? "white" : "black" }}
    >
      <Row>
        <Col xs="2">{props.seat}</Col>
        <Col style={{ position: "relative", overflow: "hidden" }} xs="10">
          {props.bookings.map((booking, i) => {
            const start = calculateStart(booking);
            const width = calculateWidth(booking);
            const isCurrentUsersBooking = getIsCurrentUsersBooking(booking);
            return (
              <ScheduleBooking
                key={i}
                booking={booking}
                start={start}
                width={width}
                isCurrentUsersBooking={isCurrentUsersBooking}
              />
            );
          })}
        </Col>
      </Row>
    </ScheduleRowContainer>
  );
}
