import React, {useState, useEffect} from "react";
import './styles.css'
import {ref,getDatabase} from 'firebase/database'
import {useAuth} from '../contexts/AuthContext'
import {Button, Alert,Container, Accordion, Row, Col} from 'react-bootstrap'
import{useNavigate} from 'react-router-dom'
import { onValue } from "@firebase/database";

export default function Profile() {
  const { currentUser,logout } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const [profileData,setProfileData]=useState();
  const [myBookings,setMyBookings]=useState();


  useEffect(()=>{
    function getProfileData(){
      try{
        const db=getDatabase();
        const profileRef = ref(db,"users/"+currentUser._delegate.uid)
        onValue(profileRef,(snapshot)=>{
          const data= snapshot.val();
          setProfileData(data)
        })
      }catch(error){
        //Some error
      }
    }
    getProfileData();
  },[currentUser._delegate.uid])

  useEffect(()=>{
    var tmpArr=[];
    const db=getDatabase();
    const allOfficesRef = ref(db,"Offices");
    onValue(allOfficesRef,(snapshot)=>{
      const data = snapshot.val();
      

      Object.keys(data).forEach(office=>{
        if(data[office].bookings){
          Object.keys(data[office].bookings).forEach(bookerId=>{
            if(bookerId===currentUser._delegate.uid){
              Object.keys(data[office].bookings[bookerId]).forEach(bookingId=>{
                tmpArr.push(data[office].bookings[bookerId][bookingId])
              })
            }
          })
        }
      })
    })

    setMyBookings(tmpArr)
  },[])
  
  async function handleLogOut(){
    setError("");
    try {
      await logout();
      navigate('/login')
    } catch {
      setError("Failed to log out");
    }
  }

  function handleGoToBooking(){
    navigate('/bookingdashboard')
  }

  function handleEditProfile(){
    navigate('/editprofile')
  }

  

  return (
    <>
    <Container className="mt-3" className="shadow-container">
      {error&&<Alert type="danger">{error}</Alert>}

      <h1 className="text-center">Profile</h1>
        {profileData && <p>Name: {profileData.name}</p>}
        {currentUser&&<p>Logged in as: {currentUser.email}</p>}
        
        {myBookings&&
        <div>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Show My Bookings</Accordion.Header>
              <Accordion.Body>
          {myBookings.map((booking,i)=>{
            
            return (<Row key={i}>
              <Col className="md-2">
                <strong>
                Office: 
                </strong>
                {booking.office} 
              </Col>
              <Col className="md-2">
              <strong>
                Date: 
                </strong>
                {booking.date} 
              </Col>
              <Col className="md-2">
              <strong>
                Seat: 
                </strong>
                {booking.seat} 
              </Col >
              <Col className="md-2">
              <strong>
                Start Time:
                </strong>
                 {booking.startTime}
              </Col>
              <Col className="md-2">
              <strong>
                End Time: 
                </strong>
                {booking.endTime}
              </Col>
            </Row>)
            
          })}
          </Accordion.Body>
          </Accordion.Item>
          </Accordion>
        </div>
        }
      <Button className="mt-3" onClick={handleEditProfile}>Edit profile info</Button>
    </Container>
    </>)
}
