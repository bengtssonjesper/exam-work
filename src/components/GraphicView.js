import React, { useEffect, useRef, useState } from "react";
import { useCanvas, drawDesk } from "./useCanvas";
import { Form } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { bookingsActions } from "../store/bookings";

export default function GraphicView() {
  const [seats, canvasRef, canvasWidth, canvasHeight] = useCanvas();
  const dispatch = useDispatch();
  const [showCanvas, setShowCanvas] = useState(false);
  const [pointer, setPointer] = useState(false);
  const [moveHandlerEnabled, setMoveHandlerEnabled] = useState(false);
  const startTimeRef = useRef();
  const endTimeRef = useRef();

  useEffect(() => {
    //This is used for not updating mouseMoveHandler as often.
    const interval = setInterval(() => {
      setMoveHandlerEnabled(true);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  function handleCanvasClick(e) {
    const canvas = document.getElementById("app-canvas");
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    seats.forEach((seat) => {
      if (
        clickX >= seat.x &&
        clickX <= seat.x + 60 &&
        clickY >= seat.y &&
        clickY <= seat.y + 40
      ) {
        console.log("You clicked on ", seat.name);
        //Här vill vi veta om den klickade platsen var röd eller grön, hur får vi reda på det?
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setShowCanvas(true);
    var tmpObj = {};
    tmpObj.startTimeRef = startTimeRef.current.value;
    tmpObj.endTimeRef = endTimeRef.current.value;
    dispatch(bookingsActions.setGraphicViewTimeRefs(tmpObj));
  }

  function handleMouseMove(e) {
    if (moveHandlerEnabled) {
      setMoveHandlerEnabled(false); //FIXA DENNA, MED INTERVAL
      const canvas = document.getElementById("app-canvas");
      const rect = canvas.getBoundingClientRect();
      const hoverX = e.clientX - rect.left;
      const hoverY = e.clientY - rect.top;
      var isPointer = false;

      seats.forEach((seat) => {
        if (
          hoverX >= seat.x &&
          hoverX <= seat.x + 60 &&
          hoverY >= seat.y &&
          hoverY <= seat.y + 40
        ) {
          // setPointer(false)
          isPointer = true;
          //Här vill vi veta om den klickade platsen var röd eller grön, hur får vi reda på det?
        }
      });
      setPointer(isPointer);
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group>
          <Form.Label>Start Time</Form.Label>
          <Form.Control type="time" ref={startTimeRef}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>End Time</Form.Label>
          <Form.Control type="time" ref={endTimeRef}></Form.Control>
        </Form.Group>
        <Button variant="contained" className="mt-2 mb-2" type="submit">
          Update
        </Button>
      </Form>
      <canvas
        style={{
          visibility: showCanvas ? "visible" : "hidden",
          cursor: pointer ? "pointer" : "default",
        }}
        id="app-canvas"
        className="app-canvas"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>
  );
}
