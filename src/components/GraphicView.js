import React, {useEffect, useRef} from 'react'
import {useCanvas, drawDesk} from './useCanvas';
import {Form, Button} from 'react-bootstrap' 
import { useDispatch } from "react-redux";
import { bookingsActions } from "../store/bookings";


export default function GraphicView() {
    const [seats, canvasRef, canvasWidth, canvasHeight]=useCanvas();
    const dispatch = useDispatch();
    
    
    const startTimeRef = useRef();
    const endTimeRef = useRef();


    function handleCanvasClick(e){
        const canvas = document.getElementById("app-canvas")
        const rect = canvas.getBoundingClientRect()
        const clickX = e.clientX-rect.left;
        const clickY = e.clientY-rect.top
        
        seats.forEach(seat=>{
            if(
                (clickX>=seat.x && clickX<=(seat.x+60))&&
                (clickY>seat.y && clickY <=(seat.y+40))){
                    console.log("You clicked on ", seat.name)
                }
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        var tmpObj={}
        tmpObj.startTimeRef=startTimeRef.current.value
        tmpObj.endTimeRef=endTimeRef.current.value
        dispatch(bookingsActions.setGraphicViewTimeRefs(tmpObj));
    }


    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="time" ref={startTimeRef}>

                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="time" ref={endTimeRef}>

                    </Form.Control>
                </Form.Group>
                <Button type="submit">Update</Button>
            </Form>
            <canvas 
            id="app-canvas"
            className="app-canvas"
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onClick={handleCanvasClick}
            ></canvas>
        </div>
    )
}
