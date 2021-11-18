import React, {useState, useEffect, useRef} from 'react'
import{getDatabase,set,ref,onValue} from 'firebase/database'
import { Button,Form,Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import './styles.css'
import {v4 as uuidv4} from 'uuid'
import{useNavigate} from 'react-router-dom'

export default function SeatBooker(props) {
    const [error,setError] = useState()
    const [message,setMessage] = useState()
    const [dbData,setDbData]=useState()
    const [loading,setLoading]=useState(false)
    const [showForm,setShowForm]=useState(false)
    const [toggleButtonInnerHTML,setToggleButtonInnerHTML]=useState("Show Booker")
    const dateRef=useRef();
    const seatRef=useRef();
    const startTimeRef=useRef();
    const endTimeRef=useRef();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        //Denna verkar köras väldigt mycket, kolla det
        getDbData();
    },[])

    function getDbData(){
        const db = getDatabase();
        const OfficesRef = ref(db, 'Offices/'+props.selectedOffice);
        onValue(OfficesRef, (snapshot) => {
            const data = snapshot.val();
            setDbData(data)
        });
    }

    function handleSubmit(e){  
        e.preventDefault();
        setError("")
        setMessage("")
        if(isBookingAllowed()){
            try{
                const db = getDatabase();
                set(ref(db,'Offices/' + props.selectedOffice+"/bookings/"+currentUser._delegate.uid + "/"+uuidv4()),{
                    user:currentUser._delegate.uid, //Förmodligen onödigt då det finns i överkategorin
                    seat:seatRef.current.value,
                    date:dateRef.current.value,
                    startTime:startTimeRef.current.value,
                    endTime:endTimeRef.current.value,
                })
                setMessage("Booking succeeded")
            }catch(error){
                setError("Failed to post booking to database")
            }
        }else{
            setError("Booking not allowed, please change input data")
        }
        
    }

    function isBookingAllowed(){
        var isAllowed=true

        const dateStartTimeRef = new Date();
        const dateEndTimeRef = new Date();
        dateStartTimeRef.setHours(startTimeRef.current.value.substr(0,2),startTimeRef.current.value.substr(3,5),0)
        dateEndTimeRef.setHours(endTimeRef.current.value.substr(0,2),endTimeRef.current.value.substr(3,5),0)

        for(const[key,value] of Object.entries(dbData.bookings)){
            for(const[childKey,childValue] of Object.entries(value)){
                if(childValue.date===dateRef.current.value&&
                    childValue.seat===seatRef.current.value&&
                    isCollision(childValue.startTime,childValue.endTime,dateStartTimeRef,dateEndTimeRef)){
                        isAllowed=false;
                }
            }
        }

        return isAllowed;
    }

    function isCollision(startTime, endTime,dateStartTimeRef,dateEndTimeRef){
        var isCollision = false
        const dateStartTime = new Date();
        const dateEndTime = new Date();

        dateStartTime.setHours(startTime.substr(0,2),startTime.substr(3,5),0)
        dateEndTime.setHours(endTime.substr(0,2),endTime.substr(3,5),0)
        if(
            (dateStartTimeRef>=dateStartTime && dateStartTimeRef<=dateEndTime )||
            (dateEndTimeRef>=dateStartTime && dateEndTimeRef<=dateEndTime)||
            (dateStartTimeRef>=dateEndTimeRef)
        ){
            isCollision = true;
        }
        return isCollision;
    }

    function handleFormToggle(){
        setLoading(true)
        if(showForm){
            setToggleButtonInnerHTML("Show Booker")
            setShowForm(false)
        }else{
            setToggleButtonInnerHTML("Hide Booker")
            setShowForm(true)
        }
        setLoading(false)
    }

    // function AddOfficeData(){
    //     try{
    //         const db = getDatabase();

    //     set(ref(db, 'Offices/Office1'), {
    //         seats:["Seat 1","Seat 2","Seat 3"],
    //         bookings:[]
            
    //     });
    //     }catch(error){ 
    //         setError("Failed to add booking")
    //     }
    // }

    function navigateToProfile(){
        navigate('/')
    }

    return (
        <>
        <div className="my-container mt-3 p-2">
            <h1>Seat Booker</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Button id="formToggleBtn" disabled={loading} onClick={handleFormToggle}>{toggleButtonInnerHTML}</Button>
            {showForm &&<Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>
                        Date
                    </Form.Label>
                    <Form.Control type="date" ref={dateRef}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Seat</Form.Label>
                    <Form.Control as="select" ref={seatRef}>
                    <option>Select a seat</option>
                    {dbData && dbData.seats.map((seat,i)=>{
                        return (<option key={i}>{seat}</option>)
                    })}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Start Time
                    </Form.Label>
                    <Form.Control ref={startTimeRef} type="time"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        End Time
                    </Form.Label>
                    <Form.Control ref={endTimeRef} type="time"></Form.Control>
                </Form.Group>
                <Button type="submit" className="mt-2">Submit</Button>
            </Form>}

        </div>
            <Button className="mt-2" onClick={navigateToProfile}>Profile</Button>
        </>
    )
}
