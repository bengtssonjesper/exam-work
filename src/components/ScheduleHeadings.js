import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function ScheduleHeadings(props) {
    return (
        <Row>
            <Col xs md="1">
                Seat
            </Col>
            <Col xs md="11" className="d-flex justify-content-between">
                {props.workHoursArray && props.workHoursArray.map((hour,i)=>{
                    return(<p key={i}>{hour}</p>)
                })}
            </Col>
        </Row>
    )
}
