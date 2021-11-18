import React,{useEffect, useState} from 'react'

export default function ScheduleBooking(props) {
    const [hovered,setHovered]=useState(false);

    console.log("props: ",props)

    const startWorkHour=6;
    const endWorkHour=18;
    const amountWorkMinutes=(endWorkHour-startWorkHour)*60;
    const startMinutes=props.startTime
    var dynamicStart = "20%"
    var dynamicWidth = "30%"


    const myStyles={
        height:"100%",
        backgroundColor:"rgba(200,200,200,0.7)",
        position:"absolute",
        top:"0",
        overflow:"hidden",
        left:props.start,
        width:props.width,
        transition:"width 1s, left 1s"
    }

    const myHoverStyles={
        backgroundColor:"rgba(200,200,200,0.9)",
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

    return (
        <>
        <div onMouseEnter={updateIsHovered} onMouseOut={updateIsNotHovered} style={{...myStyles,...(hovered?myHoverStyles:null)}} className="d-flex justify-content-between align-items-center">
            <div className="m-1">
                {props.booking.startTime}
            </div>
            <div className="m-1">
                {props.booking.endTime}
            </div>
        </div>
        </>
    )
}
