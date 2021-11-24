import React from 'react'

import {Button} from 'react-bootstrap'

import { useSelector, useDispatch } from 'react-redux'
import { bookingsActions } from '../store/bookings'

export default function ReduxTest() {
    const dispatch = useDispatch()
    const bookings = useSelector((state)=>state.bookings.bookings)
    const currentUsersBookings = useSelector((state)=>state.bookings.currentUsersBookings)

    const addBookingHandler = () => {
        dispatch(bookingsActions.addBooking({bookingInfo:"4"}));
        console.log("bookings: ", bookings)
    }

    const removeBookingHandler = () => {
        dispatch(bookingsActions.deleteBooking("1"))
    }
    const showBookingHandler = () => {
        console.log("Bookings: ", bookings)
    }

    return (
        <div>
            redux
            {/* {bookings&& bookings} */}
            {bookings&&
            Object.keys(bookings).map((booking,i)=>{
                return(<p>{bookings[booking].bookingInfo}</p>)
            })}
            <Button onClick={addBookingHandler}>Add booking</Button>
            <Button onClick={removeBookingHandler}>Remove booking</Button>
            <Button onClick={showBookingHandler}>Show booking</Button>
            
        </div>
    )
}
