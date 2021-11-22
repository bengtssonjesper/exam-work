import React, {useState, useEffect} from "react";
import './styles.css'
import {ref,getDatabase} from 'firebase/database'
import {useAuth} from '../contexts/AuthContext'
import {Button, Alert,Container, Accordion} from 'react-bootstrap'
import{useNavigate} from 'react-router-dom'
import { onValue } from "@firebase/database";

export default function Profile() {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const [profileData,setProfileData]=useState();
  const [myBookingsObj,setMyBookingsObj]=useState({});
  const today = new Date();


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
        setError("Error getting profile data")
      }
    }
    getProfileData();
  },[currentUser._delegate.uid])

  useEffect(()=>{
    var tmpObj={};
    const db=getDatabase();
    const allOfficesRef = ref(db,"Offices");
    onValue(allOfficesRef,(snapshot)=>{
      const data = snapshot.val();
      

      Object.keys(data).forEach(office=>{
        if(data[office].bookings){
          Object.keys(data[office].bookings).forEach(bookerId=>{
            if(bookerId===currentUser._delegate.uid){
              Object.keys(data[office].bookings[bookerId]).forEach(bookingId=>{
                var compDate = new Date();
                var fullDateString = data[office].bookings[bookerId][bookingId].date.substr(0,10)
                var monthString = data[office].bookings[bookerId][bookingId].date.substr(5,2)
                var dateString = data[office].bookings[bookerId][bookingId].date.substr(8,2)
                compDate.setMonth(monthString)
                compDate.setMonth(compDate.getMonth()-1) //Think this is needed for January/December
                compDate.setDate(dateString)
                if(compDate>=today){
                  if(fullDateString in tmpObj){
                    tmpObj[fullDateString].push(data[office].bookings[bookerId][bookingId])
                  }else{
                    tmpObj[fullDateString]=[data[office].bookings[bookerId][bookingId]]
                  }
                }
              })
            }
          })
        }
      })
    })
    setMyBookingsObj(tmpObj)
  },[])


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
        
        {myBookingsObj&&
        <div>


          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Show My Bookings</Accordion.Header>
              <Accordion.Body>
              {Object.keys(myBookingsObj).map((element,i)=>{
                  return(
                    <div key={i}>
                      <strong>{element}</strong>
                      {myBookingsObj[element].map((booking,j)=>{
                        return(
                          <div key={j} className="d-flex justify-content-between">
                          <p>Office: {booking.office}</p>
                          <p>Seat: {booking.seat}</p>
                          <p>Start Time: {booking.startTime}</p>
                          <p>End Time: {booking.endTime}</p>
                        </div>
                        )
                      })}
                      </div>
                  )
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
