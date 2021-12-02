import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Form,Row,Col, Alert } from "react-bootstrap";
import RecommendedBooking from "./RecommendedBooking";
import { useAuth } from "../../../contexts/AuthContext";
import Pagination from '@mui/material/Pagination';

export default function AutomaticBooking(props) {
  const { currentUser } = useAuth();
  const dateRef = useRef();
  const fromRef = useRef();
  const toRef = useRef();
  const durationRef = useRef();
  const rowsPerPage=4;
  const today = new Date();
  const [recommendedSlots,setRecommendedSlots]=useState([]);
  const [error,setError]=useState("")
  const [message,setMessage]=useState("")
  const [page, setPage] = useState(1);
  const [slotsToView, setSlotsToView] = useState([])
  const bookingsByOffice = useSelector(
    (state) => state.bookings.bookingsByOffice
  );
  const bookingsByDate = useSelector((state) => state.bookings.bookingsByDate);
  const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);
  const selectedOffice = useSelector((state) => state.bookings.selectedOffice);

  useEffect(()=>{
    setSlotsToView(recommendedSlots.slice((page-1)*rowsPerPage,page*rowsPerPage))
  },[recommendedSlots])

  useEffect(()=>{
    handleSearch();
  },[bookingsByOffice])

  function handleSearch(e) {
    //Called both from buttonclick and useEffect
    if(e){
      e.preventDefault();
    }
    var startTime = performance.now();
    var selectedFrom = new Date();
    var selectedTo = new Date();
    var initStartTime = new Date();
    var initEndTime = new Date();
    
    const selectedDuration =
      parseInt(durationRef.current.value.substr(0, 2)) +
      parseInt(durationRef.current.value.substr(3, 2)) / 60;

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
    //a slot is structured as follows: {startTime:hh:mm, endTime:hh:mm, duration:minutes seat:seat}
    var emptySlots = {};
    //For every seat in the chosen office add a slot from 00:00 to 23:59
    Object.keys(seatsByOffice[selectedOffice]).map((seat, i) => {
      emptySlots[seatsByOffice[selectedOffice][seat].name] = [
        {
          from: initStartTime,
          to: initEndTime,
          duration: (initEndTime - initStartTime) / (60 * 60 * 1000),
          seat:seatsByOffice[selectedOffice][seat].name
        },
      ];
    });

    //compareArray contains all the bookings in selectedOffice and selectedDate
    var compareArray = []
    if(bookingsByDate[dateRef.current.value]){
      compareArray = bookingsByDate[dateRef.current.value].filter(
      (booking) => booking.office === selectedOffice
    )}


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
        //Searching for the slot we collide with.
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
            seat:slot.seat
          };
          var newSlotTwo = {
            from: compareEndDate,
            to: slot.to,
            duration: (slot.to - compareEndDate) / (60 * 60 * 1000),
            seat:slot.seat
          };

          //Removes the previous slot and adds the two new slots.
          emptySlots[booking.seat].splice(i, 1, newSlotOne, newSlotTwo);
        }
      });
    });

    var viableOptions = [];
    Object.keys(emptySlots).forEach((seat, i) => {
      emptySlots[seat].forEach((slot) => {
        var compareStart = new Date();
        var compareEnd = new Date();
        //Used so that the slot starts on slot.from or selectedFrom, whichever starts latest.
        if(slot.from>selectedFrom){
          compareStart = slot.from;
        }else{
          compareStart=selectedFrom;
        }

        compareEnd.setHours(
          compareStart.getHours(),
          compareStart.getMinutes(),
          compareStart.getSeconds())
        compareEnd.setMinutes(compareStart.getMinutes()+selectedDuration*60)
        if (
          compareStart>=slot.from && compareEnd <=slot.to && compareEnd<=selectedTo
          ) {
            const pushSlot = {from:compareStart, to:compareEnd, duration:selectedDuration, seat:slot.seat}
            viableOptions.push(pushSlot);
        }
      });
    });

    var endTime = performance.now();
    console.log("takes: (ms) ", endTime - startTime);
    setRecommendedSlots(viableOptions)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    var tmpArr=[]
    tmpArr=recommendedSlots.slice((newPage-1)*rowsPerPage,newPage*rowsPerPage)
    setSlotsToView(tmpArr)
  };


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
        <Col className="mt-2 mb-2">
        <Button variant="outlined" type="submit">Search</Button>
        </Col>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {recommendedSlots.length>0 && <p>Available seats: </p>}
      {recommendedSlots && slotsToView.map((slot,i)=>{
        
        return(
          <RecommendedBooking 
            key={i} 
            slot={slot}
            date={dateRef.current.value}
            thisWeeksDatesStrings={props.thisWeeksDatesStrings}
            currentUser={currentUser}
            setError={setError}
            setMessage={setMessage}
          />
        )
      })}
      {slotsToView.length>0&&
      <Pagination color='primary' page={page} onChange={handleChangePage} count={Math.ceil(recommendedSlots.length/rowsPerPage)} />
      }
    </div>
  );
}
