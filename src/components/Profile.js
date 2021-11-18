import React, {useState, useEffect} from "react";
import {ref,getDatabase} from 'firebase/database'
import {useAuth} from '../contexts/AuthContext'
import {Button, Alert,Container} from 'react-bootstrap'
import{useNavigate} from 'react-router-dom'
import { onValue } from "@firebase/database";

export default function Profile() {
  const { currentUser,logout } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const [profileData,setProfileData]=useState();


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
  
  async function testLogOut(){
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
    <Container>
      <div>
      {error&&<Alert type="danger">{error}</Alert>}
      </div>

      <div>
      Profile
        {currentUser&&<p>Current user: {currentUser.email}</p>}
        {currentUser&&<p>UserID: {currentUser._delegate.uid}</p>}
        {profileData && <p>Name: {profileData.name}</p>}
        
        {currentUser&&
        <div>
          <p>My bookings: </p>

        </div>
        }
      </div>
      <Button onClick={testLogOut}>Logout</Button>
      <Button onClick={handleGoToBooking}>Book seat</Button>
      <Button onClick={handleEditProfile}>Edit profile info</Button>
    </Container>
    </>)
}
