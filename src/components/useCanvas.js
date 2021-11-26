import React, {useRef,useState, useEffect} from 'react'
import { useSelector } from "react-redux";


export const canvasWidth = window.innerWidth * .5;
export const canvasHeight = window.innerHeight * .5;



const seats=[
    {
        name:'Seat 1',
        x:0,
        y:5,
        facing:'down'
    },
    {
        name:'Seat 2',
        x:70,
        y:5,
        facing:'down'
    },
    {
        name:'Seat 3',
        x:140,
        y:5,
        facing:'down'
    },
    {
        name:'Seat 4',
        x:210,
        y:5,
        facing:'down'
    },
    {
        name:'Seat 5',
        x:0,
        y:40,
        facing:'up'
    },
    {
        name:'Seat 6',
        x:70,
        y:40,
        facing:'up'
    },
    {
        name:'Seat 7',
        x:140,
        y:40,
        facing:'up'
    },
    {
        name:'Seat 8',
        x:210,
        y:40,
        facing:'up'
    },
]

export function drawDesk(ctx, seat, refs){
    
    console.log("refs: ", refs)
    const deskWidth=60;
    const deskHeight=30;
    const chairWidth=20;
    const chairHeight=5;

    ctx.fillStyle='rgba(15, 184, 15, 0.5)'
    ctx.strokeStyle='rgba(15, 184, 15, 0.7)'

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
                break;
}}



export function useCanvas() {

    const canvasRef = useRef(null);
    const graphicViewTimeRefs = useSelector((state) => state.bookings.graphicViewTimeRefs);
    const seatsByOffice = useSelector((state) => state.bookings.seatsByOffice);
    const selectedOffice = useSelector((state) => state.bookings.selectedOffice);
    const seatsInSelectedOffice = seatsByOffice[selectedOffice]


    useEffect(()=>{
        const canvasObj = canvasRef.current;
        const ctx = canvasObj.getContext('2d');
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0,0, canvasWidth, canvasHeight );

        // draw all coordinates held in state
        seatsInSelectedOffice.forEach((seat)=>{drawDesk(ctx, seat, graphicViewTimeRefs)});
    });

    return ([ seatsInSelectedOffice, canvasRef, canvasWidth, canvasHeight ])
}
