import React,{useEffect, useState, useRef} from 'react'
import SeatRow from './SeatRow'
import ScheduleRow from './ScheduleRow'
import {ref,getDatabase,onValue} from 'firebase/database'
import SeatRowHeadings from './SeatRowHeadings'
import ScheduleHeadings from './ScheduleHeadings'
import {Form,Button,Row,Col} from 'react-bootstrap'

export default function SeatViewer(props) {
    const [dbData,setDbData]=useState([])
    const [view,setView]=useState("text")
    const [thisWeeksDates,setThisWeeksDates]=useState([])
    const [daySortedData, setDaySortedData]=useState()
    const dateRef = useRef("");

    useEffect(()=>{
        //Declare function in useEffect to avoid warning about dependency array
        function getDbData(){
            const db = getDatabase();
            const OfficesRef = ref(db, 'Offices/'+props.selectedOffice);
            onValue(OfficesRef, (snapshot) => {
                const data =  snapshot.val();
                setDbData(data);
                handleDateChange(data);
            });
        }
        //Denna verkar köras väldigt mycket, kolla det
        getDbData();
    },[props.selectedOffice])

    useEffect(()=>{
        getThisWeeksDates();
    },[])

    function getThisWeeksDates(){
        const today = new Date();
        var tmpArr=[];
        for(var i =0;i<7;i++){
            var tmp = new Date();
            tmp.setDate(today.getDate()+i)
            tmpArr.push(tmp)
        }
        setThisWeeksDates(tmpArr)
    }

    function handleDateChange(data){
        var tmpData=[]
        //To determine if called from onChange or from useEffect
        if('seats' in data){
            tmpData=data;
        }else{
            tmpData=dbData;
        }
        var tmpArr=[];
        if('bookings' in tmpData){
        for(const[key,value] of Object.entries(tmpData.bookings)){
            for(const[childKey,childValue] of Object.entries(value)){
                if(childValue.date===dateRef.current.value){
                    tmpArr.push(childValue)
                }
            }
        }
    }
        setDaySortedData(tmpArr)
    }

    function sortBookings(a,b){
        var timeA = new Date();
        var timeB = new Date();
        timeA.setHours(a.startTime.substr(0,2))
        timeA.setMinutes(a.startTime.substr(3,5))
        timeB.setHours(b.startTime.substr(0,2))
        timeB.setMinutes(b.startTime.substr(3,5))
        return timeA-timeB
    }

    function handleTextViewClick(){
        const textButton = document.getElementById('setTextViewBtn')
        setView("text")
    }

    function handleScheduleViewClick(){
        const scheduleButton = document.getElementById('setScheduleViewBtn')
        setView("schedule")
    }

    return (
        <div className="shadow-container">
                <h1 className="text-center">Seat Viewer</h1>
            <Row className="mt-2 mb-4">
                <Col  className="d-flex align-items-end md-6">
                <Form>
                    <Form.Group >
                    <Form.Label>Seat</Form.Label>
                        <Form.Select aria-label="Default select example" ref={dateRef} onChange={handleDateChange}>
                        <option>Select a date</option>
                        {thisWeeksDates && thisWeeksDates.map((date,i)=>{
                            return (<option key={i}>{date.getFullYear()}-{date.getMonth()+1}-{date.getDate()}</option>)
                        })}
                        </Form.Select>
                    </Form.Group>
                    </Form>
                </Col>
                <Col className="d-flex justify-content-evenly align-items-end">
                        <Button id="setTextViewBtn" variant={view==='text'? "dark":"outline-dark"} onClick={handleTextViewClick}>Text View</Button>
                        <Button id="setScheduleViewBtn" variant={view==='schedule'?"dark":"outline-dark"} onClick={handleScheduleViewClick}>Schedule View</Button>
                </Col>
            </Row>
            
            {view==="text" && dateRef.current.value!=="Select a date" && <SeatRowHeadings />}
            {view==="text"&& dateRef.current.value!=="Select a date" &&dbData && daySortedData && dbData.seats.map((seat,i)=>{
                return(
                <SeatRow 
                key={i} 
                seat={seat} 
                bookings={daySortedData.filter(booking=>booking.seat===seat).sort(sortBookings)}
                />)
            })}
            {view==="schedule" && dateRef.current.value!=="Select a date" && <ScheduleHeadings />}
            {view==="schedule"&&dateRef.current.value!=="Select a date"&&dbData && daySortedData && dbData.seats.map((seat,i)=>{
                return(
                    <ScheduleRow
                    key={i}
                    seat={seat} 
                    bookings={daySortedData.filter(booking=>booking.seat===seat).sort(sortBookings)}
                    />
                )})
            
        }
        </div>
    )
}
