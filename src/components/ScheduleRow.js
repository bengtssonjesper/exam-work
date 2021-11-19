import React from 'react'
import {Row,Col} from 'react-bootstrap'
import ScheduleBooking from './ScheduleBooking'

export default function ScheduleRow(props) {
    // const firstHour = props.scheduleStartTime;
    // const lastHour= props.scheduleEndTime;

    const firstHour=props.start;
    const lastHour=props.end;


    function calculateStart(booking){
        const amountMinutes=(lastHour-firstHour)*60
        const bookingStartMinutes = parseInt(booking.startTime.substr(0,2))*60+parseInt(booking.startTime.substr(3,5))
        const startRatio=(bookingStartMinutes-firstHour*60)/amountMinutes
        const startString=startRatio*100+"%"
        return startString
    }

    function calculateWidth(booking){
        const amountWorkMinutes=(lastHour-firstHour)*60
        const bookingStartMinutes=parseInt(booking.startTime.substr(0,2))*60+parseInt(booking.startTime.substr(3,5))
        const bookingEndMinutes=parseInt(booking.endTime.substr(0,2))*60+parseInt(booking.endTime.substr(3,5))
        const amountBookingMinutes=bookingEndMinutes-bookingStartMinutes

        const bookingWidthRatio=amountBookingMinutes/amountWorkMinutes

        const widthString=bookingWidthRatio*100+"%"

        return widthString
    }

    return (
        <div>
            <Row className="schedule-row text-center">
                <Col xs md="1">
                    {props.seat}
                </Col>
                <Col style={{position:"relative", overflow:"hidden"}} xs md="11">
                {props.bookings.map((booking,i)=>{
                    const start=calculateStart(booking)
                    const width=calculateWidth(booking)
                    return(<ScheduleBooking key={i} booking={booking} start={start} width={width}/>)
                })}
                </Col>  
            </Row>
        </div>
    )
}
