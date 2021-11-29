import React, { useState, useRef } from "react";
import "./styles.css";
import { Button } from "react-bootstrap";

import ManualBooking from "./ManualBooking";
import AutomaticBooking from "./AutomaticBooking";

export default function SeatBooker(props) {
  const [booking, setBooking] = useState("manual");

  function handleManualBooking() {
    setBooking("manual");
  }
  function handleAutomaticBooking() {
    setBooking("automatic");
  }

  return (
    <>
      <div className="shadow-container mt-3 p-2">
        <h1 className="text-center">Seat Booker</h1>
        <Button
          variant={booking === "manual" ? "dark" : "outline-dark"}
          onClick={handleManualBooking}
        >
          Manual
        </Button>
        <Button
          variant={booking === "automatic" ? "dark" : "outline-dark"}
          onClick={handleAutomaticBooking}
        >
          Automatic
        </Button>
        {booking === "manual" && (
          <ManualBooking
            thisWeeksDatesStrings={props.thisWeeksDatesStrings}
            selectedOffice={props.selectedOffice}
          />
        )}
        {booking === "automatic" && <AutomaticBooking />}
      </div>
    </>
  );
}
