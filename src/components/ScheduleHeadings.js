import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function ScheduleHeadings() {

    const workHours=["06", "07", "08","09","10","11","12","13","14","15","16","17","18"]

    return (
        <Row>
            <Col xs md="1">
                Seat
            </Col>
            <Col xs md="11" className="d-flex justify-content-between">
                {workHours.map((hour,i)=>{
                    return(<p>{hour}</p>)
                })}
            </Col>
        </Row>
    )
}
