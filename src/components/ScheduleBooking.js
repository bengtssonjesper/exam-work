import React,{useEffect, useState, useRef} from 'react'
import {Popover,OverlayTrigger} from 'react-bootstrap'

export default function ScheduleBooking(props) {
    const [hovered,setHovered]=useState(false);
    const [showTooltip,setShowTooltip]=useState(false);
    const target = useRef(null);
    var timer;

    console.log("props: ",props)

    const startWorkHour=6;
    const endWorkHour=18;
    const amountWorkMinutes=(endWorkHour-startWorkHour)*60;
    const startMinutes=props.startTime
    var dynamicStart = "20%"
    var dynamicWidth = "30%"


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

    const myHoverStyles={
        backgroundColor:"rgba(180,180,180,1)",
        left:"0",
        width:"100%",
        zIndex:"1"
    }

    function updateIsHovered(){
        if(!hovered){
            setHovered(true)
        }
    }

    function updateIsNotHovered(){
        if(hovered){
            setHovered(false)
        }
    }

    function testMouseEnter(){
        timer= setTimeout(setShowTooltip(true),1000)
    }

    function testMouseLeave(){
        clearTimeout(timer)
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
        <OverlayTrigger placement="right" overlay={popover}>
        {/*<div ref={target} onClick={()=>{setShowTooltip(!showTooltip)}} onMouseEnter={updateIsHovered} onMouseOut={updateIsNotHovered} style={{...myStyles,...(hovered?myHoverStyles:null)}}style={{...myStyles}} className="d-flex justify-content-between align-items-center"> */}
        <div ref={target} /*onMouseEnter={testMouseEnter} onMouseOut={testMouseLeave} style={{...myStyles,...(hovered?myHoverStyles:null)}}*/style={{...myStyles}} className="d-flex justify-content-between align-items-center">
            <p style={{pointerEvents:"none"}} className="m-1">
                {props.booking.startTime}
            </p>
            <p style={{pointerEvents:"none"}} className="m-1">
                {props.booking.endTime}
            </p>
        </div>
        </OverlayTrigger>
        
        </>
    )
}
