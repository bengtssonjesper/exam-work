import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function SeatRowBooking(props) {
   
    return (
        <div>
            <Row>
                <Col xs md="3">
                    {props.booking.date}
                </Col>
                <Col xs md="3">
                    {props.booking.name}
                </Col>
                <Col xs md="3">
                    {props.booking.startTime}
                </Col>
                <Col xs md="3">
                    {props.booking.endTime}
                </Col>
            </Row>
        </div>
    )
}
