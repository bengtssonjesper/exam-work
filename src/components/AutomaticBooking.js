import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Form } from "react-bootstrap";

export default function AutomaticBooking(props) {
  //Leta igenom och hitta lediga luckor? Filtrera bort för korta luckor

  const dateRef = useRef();
  const fromRef = useRef();
  const toRef = useRef();
  const durationRef = useRef();
  const today = new Date();

  const bookingsByOffice = useSelector(
    (state) => state.bookings.bookingsByOffice
  );
  const bookingsByDate = useSelector((state) => state.bookings.bookingsByDate);
  const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);
  const selectedOffice = useSelector((state) => state.bookings.selectedOffice);

  function handleSearch(e) {
    e.preventDefault();
    var startTime = performance.now();
    console.log("duration: ", durationRef.current.value);
    const selectedDuration =
      parseInt(durationRef.current.value.substr(0, 2)) +
      parseInt(durationRef.current.value.substr(3, 2)) / 60;

    var selectedFrom = new Date();
    var selectedTo = new Date();
    var initStartTime = new Date();
    var initEndTime = new Date();

    selectedFrom.setFullYear(
      dateRef.current.value.substr(0, 4),
      parseInt(dateRef.current.value.substr(5, 2)) - 1,
      dateRef.current.value.substr(8, 2)
    );
    selectedFrom.setHours(
      fromRef.current.value.substr(0, 2),
      fromRef.current.value.substr(3, 2),
      0
    );

    selectedTo.setFullYear(
      dateRef.current.value.substr(0, 4),
      parseInt(dateRef.current.value.substr(5, 2)) - 1,
      dateRef.current.value.substr(8, 2)
    );
    selectedTo.setHours(
      toRef.current.value.substr(0, 2),
      toRef.current.value.substr(3, 2),
      0
    );

    initStartTime.setHours(0, 0, 0);
    initEndTime.setHours(23, 59, 0);

    //emptySlots should contain what available spots there are,
    //a slot is structured as follows: {startTime:hh:mm, endTime:hh:mm, duration:minutes? seat:seat office? date?}
    var emptySlots = {};
    Object.keys(seatsByOffice[selectedOffice]).map((seat, i) => {
      emptySlots[seatsByOffice[selectedOffice][seat].name] = [
        {
          from: initStartTime,
          to: initEndTime,
          duration: (initEndTime - initStartTime) / (60 * 60 * 1000),
        },
      ];
    });

    var compareArray = bookingsByDate[dateRef.current.value].filter(
      (booking) => booking.office === selectedOffice
    );

    compareArray.forEach((booking) => {
      var compareStartDate = new Date();
      compareStartDate.setFullYear(
        dateRef.current.value.substr(0, 4),
        parseInt(dateRef.current.value.substr(5, 2)) - 1,
        dateRef.current.value.substr(8, 2)
      );
      compareStartDate.setHours(
        booking.startTime.substr(0, 2),
        booking.startTime.substr(3, 2),
        0
      );
      emptySlots[booking.seat].forEach((slot, i) => {
        //Letar efter den slot vi krockar med.
        if (compareStartDate >= slot.from && compareStartDate <= slot.to) {
          var compareEndDate = new Date();
          compareEndDate.setFullYear(
            dateRef.current.value.substr(0, 4),
            parseInt(dateRef.current.value.substr(5, 2)) - 1,
            dateRef.current.value.substr(8, 2)
          );
          compareEndDate.setHours(
            booking.endTime.substr(0, 2),
            booking.endTime.substr(3, 2),
            0
          );
          var newSlotOne = {
            from: slot.from,
            to: compareStartDate,
            duration: (compareStartDate - slot.from) / (60 * 60 * 1000),
          };
          var newSlotTwo = {
            from: compareEndDate,
            to: slot.to,
            duration: (slot.to - compareEndDate) / (60 * 60 * 1000),
          };

          //Removes the previous slot and adds the two new slots.
          emptySlots[booking.seat].splice(i, 1, newSlotOne, newSlotTwo);
        }
      });
    });
    var viableOptions = [];
    Object.keys(emptySlots).forEach((seat, i) => {
      emptySlots[seat].forEach((slot) => {
        console.log("slot: ", slot);
        if (
          slot.from <= selectedFrom &&
          slot.to >= selectedTo &&
          slot.duration >= selectedDuration
        ) {
          viableOptions.push(slot);
        }
      });
    });

    //Nu har vi de luckor som är tillräckligt stora, nu ska vi ge förslag baserade på dessa.

    var endTime = performance.now();
    console.log("takes: (ms) ", endTime - startTime);
    console.log("viable: ", viableOptions);
  }

  return (
    <div>
      <Form onSubmit={handleSearch}>
        {today && (
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              ref={dateRef}
              defaultValue={
                props.today.getFullYear() +
                "-" +
                (props.today.getMonth() + 1) +
                "-" +
                props.today.getDate()
              }
              required
            />
          </Form.Group>
        )}
        <Form.Group>
          <Form.Label>Search From</Form.Label>
          <Form.Control
            type="time"
            ref={fromRef}
            defaultValue="07:00"
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Search To</Form.Label>
          <Form.Control type="time" ref={toRef} defaultValue="17:00" required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Duration (h:m)</Form.Label>
          <Form.Control
            type="time"
            ref={durationRef}
            defaultValue="08:00"
            required
          />
        </Form.Group>
        <Button type="submit">Search</Button>
      </Form>
    </div>
  );
}
