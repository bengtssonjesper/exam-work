import React, {useRef,useState, useEffect} from 'react'
import { useSelector } from "react-redux";
import { isCollision } from './HelperFunctions';


// export const canvasWidth = window.innerWidth * .9;
// export const canvasHeight = window.innerHeight * .9;
export const canvasWidth = Math.min(400,window.innerWidth * .9);
export const canvasHeight = 400;


export function drawDesk(ctx, seat, selectedDate, selectedStartTime, selectedEndTime, bookingsInSelectedOffice){

    var filteredBookings=[]
    if(bookingsInSelectedOffice){
        filteredBookings = bookingsInSelectedOffice.filter(booking=>(
        booking.date===selectedDate&&booking.seat===seat.name)
    )}

    const deskWidth=60;
    const deskHeight=30;
    const chairWidth=20;
    const chairHeight=5;
    ctx.font='12px Poppins'
    if(isCollision(selectedStartTime, selectedEndTime, filteredBookings)){
        ctx.fillStyle='rgba(209, 26, 26, 0.5)'
        ctx.strokeStyle='rgba(209, 26, 26, 0.7)'
    }else{
        ctx.fillStyle='rgba(15, 184, 15, 0.5)'
        ctx.strokeStyle='rgba(15, 184, 15, 0.7)'
    }

    switch(seat.facing){
        case 'up':
            ctx.beginPath();
            ctx.rect(seat.x,seat.y,deskWidth,deskHeight)
            ctx.fill()
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(seat.x+(deskWidth/2)-(chairWidth/2),seat.y+deskHeight,chairWidth,chairHeight)
            ctx.fill()
            ctx.stroke();
            ctx.fillStyle = 'rgb(0,0,0)'
            ctx.beginPath();
            
            ctx.fillText(seat.name,seat.x+(deskHeight/2),seat.y+(deskHeight/2))
            break;
        case 'down':
            ctx.beginPath();
            ctx.rect(seat.x,seat.y,deskWidth,deskHeight)
            ctx.fill()
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(seat.x+(deskWidth/2)-(chairWidth/2),seat.y-chairHeight,chairWidth,chairHeight)
            ctx.fill()
            ctx.stroke();
            ctx.fillStyle = 'rgb(0,0,0)'
            ctx.beginPath();
            
            ctx.fillText(seat.name,seat.x+(deskHeight/2),seat.y+(deskHeight/2))
            break;
        case 'left':
            ctx.beginPath();
            ctx.rect(seat.x,seat.y,deskHeight,deskWidth)
            ctx.fill()
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(seat.x+deskHeight,seat.y+(deskWidth/2)-(chairWidth/2),chairHeight,chairWidth)
            ctx.fill()
            ctx.stroke();
            ctx.fillStyle = 'rgb(0,0,0)'
            ctx.beginPath();
            
            ctx.fillText(seat.name,seat.x+(deskHeight/2),seat.y+(deskHeight/2))
            break;
        case 'right':
                ctx.beginPath();
                ctx.rect(seat.x,seat.y,deskHeight,deskWidth)
                ctx.fill()
                ctx.stroke();
                ctx.beginPath();
                ctx.rect(seat.x-chairHeight,seat.y+(deskWidth/2)-(chairWidth/2),chairHeight,chairWidth)
                ctx.fill()
                ctx.stroke();
                ctx.fillStyle = 'rgb(0,0,0)'
            ctx.beginPath();
            
            ctx.fillText(seat.name,seat.x+(deskHeight/2),seat.y+(deskHeight/2))
                break;
}}




export function useCanvas() {


    const canvasRef = useRef(null);
    const graphicViewTimeRefs = useSelector((state) => state.bookings.graphicViewTimeRefs);
    const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);
    const selectedOffice = useSelector((state) => state.bookings.selectedOffice);
    const selectedDate = useSelector((state) => state.bookings.viewDate);
    const bookingsByOffice = useSelector((state) => state.bookings.bookingsByOffice);
    const bookingsInSelectedOffice = bookingsByOffice[selectedOffice]
    const seatsInSelectedOffice = seatsByOffice[selectedOffice]
    

    useEffect(()=>{        
        const canvasObj = canvasRef.current;
        const ctx = canvasObj.getContext('2d');
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0,0, canvasWidth, canvasHeight );

        // draw all coordinates held in state
        seatsInSelectedOffice.forEach((seat)=>{drawDesk(ctx, seat, selectedDate , graphicViewTimeRefs['startTimeRef'],graphicViewTimeRefs['endTimeRef'], bookingsInSelectedOffice)});
    });
    return ([ seatsInSelectedOffice, canvasRef, canvasWidth, canvasHeight ])
}
