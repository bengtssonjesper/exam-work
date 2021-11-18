import React from 'react'
import {Row,Col} from 'react-bootstrap'
import SeatRowBooking from './SeatRowBooking'

export default function SeatRow(props) {

    return (
        <div className="seatRowContainer">
            <Row className="text-center">
                <Col xs md="2">
                    {props.seat}
                </Col>
                <Col xs md="10">
                {props.bookings.map((booking,i)=>{
                    return(<SeatRowBooking key={i} booking={booking}/>)
                })}
                </Col>
            </Row>
        </div>
    )
}
