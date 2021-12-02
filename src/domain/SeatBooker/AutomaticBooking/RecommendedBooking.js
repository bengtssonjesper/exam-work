import React from 'react'
import {Row, Col} from 'react-bootstrap'
import Button from "@mui/material/Button";
import { createBooking } from '../../../helper/HelperFunctions';
import { useSelector } from "react-redux";

export default function RecommendedBooking(props) {
    const bookingsByOffice = useSelector(
        (state) => state.bookings.bookingsByOffice
      );
      const selectedOffice = useSelector(
        (state) => state.bookings.selectedOffice
      );

    function handleCreateBooking(){
        const startTime=
            (props.slot.from.getHours()<10?"0"+props.slot.from.getHours():props.slot.from.getHours())+
            ":"+
            (props.slot.from.getMinutes()<10?"0"+props.slot.from.getMinutes():props.slot.from.getMinutes())
        const endTime=
            (props.slot.to.getHours()<10?"0"+props.slot.to.getHours():props.slot.to.getHours())+
            ":"+
            (props.slot.to.getMinutes()<10?"0"+props.slot.to.getMinutes():props.slot.to.getMinutes())

        props.setError("")
        props.setMessage("")
            createBooking(
                props.slot.seat,
                props.date,
                props.thisWeeksDatesStrings,
                props.currentUser,
                startTime,
                endTime,
                bookingsByOffice,
                selectedOffice,
                props.setError,
                props.setMessage
            )
    }

    return (
        <Row className="mt-1 mb-1">
            <Col className="xs md-3">Seat: {props.slot.seat}</Col>
            <Col className="xs md-3">From: {props.slot.from.getHours()<10?"0"+props.slot.from.getHours():props.slot.from.getHours()}:{props.slot.from.getMinutes()<10?"0"+props.slot.from.getMinutes():props.slot.from.getMinutes()} </Col>
            <Col className="xs md-3">To: {props.slot.to.getHours()<10?"0"+props.slot.to.getHours():props.slot.to.getHours()}:{props.slot.to.getMinutes()<10?"0"+props.slot.to.getMinutes():props.slot.to.getMinutes()} </Col>
            <Col className="xs md-3"><Button variant="contained" onClick={handleCreateBooking}>Book</Button></Col>
        </Row>
    )
}
