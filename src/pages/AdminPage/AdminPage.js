import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { ref, set, getDatabase, onValue } from "firebase/database";
import { theme } from "../../styles/theme";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {AdminHeader, AdminBody} from './styles'
import { useAuth} from '../../contexts/AuthContext'


export default function AdminPage() {
  const {currentUser} = useAuth();
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [dbData, setDbData] = useState([]);
  const [whatView, setWhatView] = useState("addOffice");
  const adminUidRef = useRef();


  useEffect(() => {
    //Förmdoligen bättre att köra detta när man klickar med clean database
    //Får dock problem med asynd/await
    getDbData();
  }, []);

  function getDbData() {
    const db = getDatabase();
    const dbRef = ref(db, "Offices");
    onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        setDbData(data);
      },
      {
        onlyOnce: true,
      }
    );
  }

  function handleDatabaseClean() {
    //Hämta hem alla bokningar, loopa igenom och ta bort dem som har datum tidigare än idag.
    const today = new Date();
    const db = getDatabase();

    for (const [key, officeObject] of Object.entries(dbData)) {
      if ("bookings" in officeObject) {
        for (const [bookerId, bookingsArr] of Object.entries(
          officeObject["bookings"]
        )) {
          for (const [bookingId, booking] of Object.entries(bookingsArr)) {
            const year = booking.date.substr(0, 4);
            const month = parseInt(booking.date.substr(5, 2)) - 1;
            const date = booking.date.substr(8, 2);
            const cmpDate = new Date(year, month, date);
            cmpDate.setHours(23, 59, 59);
            if (cmpDate < today) {
              const removeRef = ref(
                db,
                "Offices/" + key + "/bookings/" + bookerId + "/" + bookingId
              );
              set(removeRef, {
                //Setting to an empty object will delete the booking
              });
            }
          }
        }
      }
    }
  }

  function handleAddAdmin(e){
    e.preventDefault()
    console.log("hit")
    setMessage("")
    setError("")
    const db = getDatabase();
      set(
        ref(
          db, 
          "Admins/"+adminUidRef.current.value),{
            uid:adminUidRef.current.value
          }).then(()=>{
            setMessage("Admin added");
          })
          .catch((error)=>{
            setError(error['code'])
          });
  }

  const handleChangeView = (event, newValue) => {
    setWhatView(newValue);
  };



  // function addOffices(){
  //   setMessage("")
  //   setError("")
  //   const db = getDatabase();
  //   set(
  //     ref(
  //       db,
  //       "offices/Fabriksgatan"),{
  //         seats:["seat1","seat2","seat3","seat4","seat5","seat6","seat7","seat8","seat9","seat10","seat11","seat12","seat13","seat14","seat15","seat16", ]
  //       }
        
  //     )}
    

  return (
  <>

    <AdminHeader>
    <h1>PROFILE</h1>
    <Tabs value={whatView} onChange={handleChangeView} aria-label="icon label tabs example"  >
      <Tab value="addOffice" label="ADD OFFICE" sx={{color:`${theme.palette.secondary.main}`}} />
      <Tab value="addAdmin" label="ADD ADMIN" sx={{color:`${theme.palette.secondary.main}`}} />
    </Tabs>
  </AdminHeader>

  <AdminBody>
    {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    {whatView==='addOffice'&&
      <p>Add Office</p>
      //Lista alla offices och seats, fixa input fields så man kan lägga till offices och seats.
    }
    {whatView==='addAdmin'&&
        <Form onSubmit={handleAddAdmin}>
          <Form.Group>
            <Form.Label>Admin UID</Form.Label>
            <Form.Control type="text" ref={adminUidRef}/>
          </Form.Group>
          <Button type="submit">Add admin</Button>
        </Form>
    }

    {/* <Button onClick={addOffices}>Add Offices</Button> */}
    
  </AdminBody>

</>
  );
}