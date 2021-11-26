import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function SeatRowHeadings() {
    return (
        <div>
            <Row className="text-center">
                <Col xs="2">
                    <strong>Seat</strong>
                </Col>
                <Col xs="10">
                    <Row className="d-flex justify-content-evenly">
                    <Col xs="4">
                        <strong>Date</strong>
                    </Col>
                    {/* <Col xs md="3">
                        <strong>Name</strong>
                    </Col> */}
                    <Col xs="4">
                        <strong>Start Time</strong>
                    </Col>
                    <Col xs="4">
                        <strong>End Time</strong>
                    </Col>
                    </Row>
                    </Col>
            </Row>
        </div>
    )
}
