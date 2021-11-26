import React from 'react'
import {Row,Col} from 'react-bootstrap'
import SeatRowBooking from './SeatRowBooking'
import {useAuth} from '../contexts/AuthContext'

export default function SeatRow(props) {

    const { currentUser } = useAuth();


    function getIsCurrentUsersBooking(booking){
        var isCurrentUsersBooking = false;
        if(currentUser._delegate.uid===booking.user){
            isCurrentUsersBooking=true;
        }
        return isCurrentUsersBooking;
    }


    return (
        <div className="seatRowContainer overflow-hidden">
            <Row className="text-center overflow-hidden">
                <Col xs="2">
                    {props.seat}
                </Col>
                <Col xs="10" >
                {props.bookings.map((booking,i)=>{
                    const isCurrentUsersBooking=getIsCurrentUsersBooking(booking)
                    return(<SeatRowBooking key={i} booking={booking} isCurrentUsersBooking={isCurrentUsersBooking}/>)
                })}
                </Col>
            </Row>
        </div>
    )
}
