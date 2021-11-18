import React,{useEffect, useState, useRef} from 'react'
import SeatRow from './SeatRow'
import {ref,getDatabase,onValue} from 'firebase/database'
import SeatRowHeadings from './SeatRowHeadings'
import {Form} from 'react-bootstrap'

export default function SeatViewer(props) {
    const [dbData,setDbData]=useState([])
    const [thisWeeksDates,setThisWeeksDates]=useState([])
    const [daySortedData, setDaySortedData]=useState()
    const dateRef = useRef("");

    useEffect(()=>{
        //Declare function in useEffect to avoid warning about dependency array
        function getDbData(){
            const db = getDatabase();
            const OfficesRef = ref(db, 'Offices/'+props.selectedOffice);
            onValue(OfficesRef, (snapshot) => {
                const data = snapshot.val();
                setDbData(data);
            });
        }
        //Denna verkar köras väldigt mycket, kolla det
        getDbData();
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

    function handleDateChange(){
        var tmpArr=[];
        for(const[key,value] of Object.entries(dbData.bookings)){
            for(const[childKey,childValue] of Object.entries(value)){
                if(childValue.date===dateRef.current.value){
                    tmpArr.push(childValue)
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

    return (
        <div className="my-container mt-3 p-2">
            <h1>SeatViewer</h1>
            <Form.Group >
                    <Form.Label>Seat</Form.Label>
                    <Form.Control as="select" ref={dateRef} onChange={handleDateChange}>
                    <option>Select a date</option>
                    {thisWeeksDates && thisWeeksDates.map((date,i)=>{
                        return (<option key={i}>{date.getFullYear()}-{date.getMonth()+1}-{date.getDate()}</option>)
                    })}
                    </Form.Control>
            </Form.Group>
            {dateRef.current.value!=="Select a date" && <SeatRowHeadings/>}
            {dateRef.current.value!=="Select a date" &&dbData && daySortedData && dbData.seats.map((seat,i)=>{
                return(
                <SeatRow 
                key={i} 
                seat={seat} 
                bookings={daySortedData.filter(booking=>booking.seat===seat).sort(sortBookings)}
                />)
            })}
        </div>
    )
}
