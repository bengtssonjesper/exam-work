import React, {useState} from 'react'
import {Row,Col} from 'react-bootstrap'
import BookingModal from '../../../components/BookingModal/BookingModal';

export default function SeatRowBooking(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const myStyles={
        // width:"100%",
        backgroundColor:"rgba(200,200,200,0.2)",
        borderRadius:"5px"
    }

    const currentUserStyles={
        backgroundColor:"rgba(150,10,90,0.2)",
        cursor:"pointer",
    }
   
    return (
        <div>
            {show&&
            <BookingModal setShow={setShow} show={show} booking={props.booking} handleClose={handleClose} />
        }
            <Row className="d-flex justify-content-evenly" onClick={props.isCurrentUsersBooking?handleShow:null} style={{...myStyles,...(props.isCurrentUsersBooking?currentUserStyles:null)}}>
                <Col xs="4">
                    {props.booking.date}
                </Col>
                {/* <Col xs md="auto">
                    {props.booking.name}
                </Col> */}
                <Col xs="4">
                    {props.booking.startTime}
                </Col>
                <Col xs="4">
                    {props.booking.endTime}
                </Col>
            </Row>
        </div>
    )
}