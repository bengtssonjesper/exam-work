import React,{useRef, useState, useEffect} from 'react'
import {Container, Form,Button} from 'react-bootstrap'
import SeatViewer from './SeatViewer'
import SeatBooker from './SeatBooker'
import {getDatabase,ref, onValue} from 'firebase/database'

export default function BookingDashboard() {
    const selectedOfficeRef = useRef("");
    const [offices, setOffices] = useState([])
    const [selectedOffice,setSelectedOffice] = useState();
    const [showViewerAndBooker, setShowViewerAndBooker] = useState(false);


    useEffect(()=>{
        function getOffices(){
            var tmpArr = [];
            const db = getDatabase();
            const officesRef = ref(db,"Offices");
            onValue(officesRef, snapshot=>{
                const data = snapshot.val();
                Object.keys(data).map(office=>{
                    tmpArr.push(office)
                })
                setOffices(tmpArr)
            })
        }
        getOffices();
    },[])
    
    function handleOnChange(){
        //Using selectedOffice as state to force rerender of childs on update
        setSelectedOffice(selectedOfficeRef.current.value)
        if(selectedOfficeRef.current.value==="Select an office"){
            setShowViewerAndBooker(false)
        }else{
            setShowViewerAndBooker(true)
        }
    }

    return (
        <>
        <Container  className="shadow-container">
        <div>
            <Form>
                <Form.Label>Office</Form.Label>
                <Form.Select aria-label="Default select example" onChange={handleOnChange} ref={selectedOfficeRef}>
                    <option>Select an office</option>
                    {offices && offices.map((office,i)=>{
                        return(<option key={i}>{office}</option>)
                    })}
                    </Form.Select>
            </Form>
        </div>
        {showViewerAndBooker&&
        <div>
            <div id="seatViewer">
            <SeatViewer selectedOffice={selectedOffice}></SeatViewer>
            </div>
            <div id="seatBooker">
            <SeatBooker selectedOffice={selectedOffice}></SeatBooker>
            </div>
        </div>
        }
         
        

        
        </Container>
        </>
    )
}
