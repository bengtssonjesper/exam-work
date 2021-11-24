import React, {useRef, useState, useEffect} from 'react'
import {Modal,Button, Form,Alert} from 'react-bootstrap'
import {set,ref,getDatabase,onValue} from 'firebase/database'
import { updateBooking,getBookingsFromSelectedOffice } from './HelperFunctions';

export default function BookingModal(props) {
    const startTimeRef=useRef();
    const endTimeRef=useRef();
    const [showUpdateForm,setShowUpdateForm]=useState(false)
    const [dbData, setDbData]=useState();
    const [arrayOfBookings, setArrayOfBookings]=useState();
    const [error,setError]=useState();
    const [message,setMessage]=useState();

    useEffect(()=>{
        getDbData();
    },[])

    function getDbData(){
        const db = getDatabase();
        const officeRef = ref(db,'Offices/'+props.booking['office']);
        onValue(officeRef,(snapshot)=>{
            const data = snapshot.val();
            const tmpArr = getBookingsFromSelectedOffice(data,props.booking['bookingId'])
            setArrayOfBookings(tmpArr)
        },{
            onlyOnce:true
        })
    }


    function handleDeleteBooking(){
        props.setShow(false)
        const db = getDatabase();
        const removeRef = ref(db, 'Offices/'+props.booking['office']+'/bookings/'+props.booking['user']+'/'+props.booking['bookingId'])
        set(removeRef,{
            //Setting an empty object will delete the booking
        })                
      }

    function handleUpdateBooking(){
        setShowUpdateForm(true)
    }
    
    function handleUpdateSubmit(e){
        e.preventDefault();
        const bookingsOnSameSeat = arrayOfBookings.filter(booking_=>
            ((booking_['seat']===props.booking['seat'])&&
            (booking_['date']===props.booking['date']))
        )
        updateBooking(startTimeRef.current.value,endTimeRef.current.value,props.booking, bookingsOnSameSeat, setError, setMessage);
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>What do you wish to do with this booking?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {showUpdateForm && 
            <div>
                <p>Please enter the new times</p>
            <Form onSubmit={handleUpdateSubmit}>
                <Form.Group>
                    <Form.Label>
                        Start Time: 
                    </Form.Label>
                    <Form.Control ref={startTimeRef} type="time" required></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        End Time: 
                    </Form.Label>
                    <Form.Control ref={endTimeRef} type="time" required></Form.Control>
                </Form.Group>
                <Button className="mt-2 mb-2" type="submit">Update booking</Button>
            </Form>
            </div>}
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleUpdateBooking}>
            Update booking
          </Button>
          <Button variant="danger" onClick={handleDeleteBooking}>
            Delete booking
          </Button>
        </Modal.Footer>
      </Modal>
    )
}
