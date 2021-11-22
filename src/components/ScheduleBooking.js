import { set,ref, getDatabase } from '@firebase/database';
import React,{useState, useRef} from 'react'
import {Popover,OverlayTrigger} from 'react-bootstrap'
import BookingModal from './BookingModal'

export default function ScheduleBooking(props) {
    const target = useRef(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const myStyles={
        height:"90%",
        backgroundColor:"rgba(200,200,200,0.7)",
        border:"1px solid rgba(170,170,170,0.7)",
        borderRadius:"5px",
        position:"absolute",
        top:"5%",
        overflow:"hidden",
        left:props.start,
        width:props.width,
        transition:"width 0.5s, left 0.5s"
    }

    const currentUserStyles={
        backgroundColor:"rgba(150,10,90,0.5)",
        cursor:"pointer"
    }

    const popover = (
        <Popover id="popover-basic">
          <Popover.Body>
           <strong> Start time:</strong> {props.booking.startTime}<br/>
            <strong>End time:</strong> {props.booking.endTime}
          </Popover.Body>
        </Popover>
      );

    return (
        <>
        {show&&
            <BookingModal setShow={setShow} show={show} booking={props.booking} handleClose={handleClose} />
        }
        <OverlayTrigger placement="right" overlay={popover} >
        
        {props && <div ref={target} style={{...myStyles,...(props.isCurrentUsersBooking?currentUserStyles:null)}} onClick={props.isCurrentUsersBooking?handleShow:null} className="d-flex justify-content-between align-items-center">
            <p style={{pointerEvents:"none"}} className="m-1">
                {props.booking.startTime}
            </p>
            <p style={{pointerEvents:"none"}} className="m-1">
                {props.booking.endTime}
            </p>
        </div>
}
        </OverlayTrigger>
        
        </>
    )
}
