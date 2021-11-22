import React, {useState, useEffect} from 'react'
import {Button,Container,Row,Col} from 'react-bootstrap'
import {ref,set,getDatabase, onValue} from 'firebase/database'

export default function AdminPage() {
    const [dbData,setDbData]=useState([])

    useEffect(()=>{
        //Förmdoligen bättre att köra detta när man klickar med clean database
        //Får dock problem med asynd/await
        getDbData();
    },[])



    function getDbData(){
        const db = getDatabase();
        const dbRef = ref(db,'Offices');
        onValue(dbRef,(snapshot)=>{
            const data = snapshot.val();
            setDbData(data);
        },{
            onlyOnce:true
        })  
    }
        

    function handleDatabaseClean(){
        //Hämta hem alla bokningar, loopa igenom och ta bort dem som har datum tidigare än idag.
        const today = new Date();
        const db = getDatabase();

        for(const [key,officeObject] of Object.entries(dbData)){
            if('bookings' in officeObject){
                for(const [bookerId,bookingsArr] of Object.entries(officeObject['bookings'])){
                    for(const [bookingId,booking] of Object.entries(bookingsArr)){
                        const year = booking.date.substr(0,4)
                        const month = parseInt(booking.date.substr(5,2))-1
                        const date = booking.date.substr(8,2)
                        const cmpDate=new Date(year,month,date)
                        cmpDate.setHours(23,59,59)
                        if(cmpDate<today)
                        {
                            const removeRef = ref(db, 'Offices/'+key+'/bookings/'+bookerId+'/'+bookingId)
                            set(removeRef,{
                                //Setting to an empty object will delete the booking
                            })                
                        }
                    }
                    }
                }
        }
    }

    return (
        <div className="shadow-container">
                <Row><h3>Admin functions</h3></Row>
            {/* FIX ADMIN PERMISSION FOR THIS FUNCTIONALITY */}
            <Button onClick={handleDatabaseClean}>Clean database</Button>
        </div>
    )
}
