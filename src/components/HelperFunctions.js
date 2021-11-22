import {ref, set, getDatabase } from "@firebase/database"

export function createBooking(newStartTime, newEndTime, booking, arrayOfBookings, setError, setMessage){
    const db = getDatabase()
    setError("")
    setMessage("")
    console.log("first: ",booking )
    console.log("third: ", arrayOfBookings)
    console.log(booking['office'])
    console.log(booking['user'])
    console.log(booking['bookingId'])
    console.log(newStartTime)
    console.log(newEndTime)
    const refStr="Offices/"+booking['office']+"/bookings/"+booking['user']+'/'+booking['bookingId']
    console.log("refstr: ", refStr)
    try{
        if(isBookingAllowed(newStartTime,newEndTime,arrayOfBookings)){
            // set(ref(db, 'Offices/'+booking['office']+'/bookings/'+booking['user']+'/'+booking['bookingId']),{
            set(ref(db, refStr),{
                bookingId:booking['bookingId'],
                date:booking['date'],
                endTime:newEndTime,
                office:booking['office'],
                seat:booking['seat'],
                startTime:newStartTime,
                user:booking['user']
            })
            setMessage("Success")
        }else{
            setError("Some error")
        }
    }catch(error){
        setError("Some other error")
    }
    

}

export function isBookingAllowed(one,two,three){
    var isAllowed=true;
    return isAllowed;


}

export function isBookingCollision(){

}

export function getBookingsFromSelectedOffice(data, exceptionBookingId){
    //Input: The object that is fetched from one specific office
    //Output: An array of all the objects in that office
    //Notes: The function will not add the exceptionBooking to the array,
    var tmpArr=[]

    if('bookings' in data){
        for(const[userId,bookings] of Object.entries(data['bookings'])){
            for(const[bookingId,booking] of Object.entries(bookings)){
                if(booking.bookingId!==exceptionBookingId){
                    tmpArr.push(booking)
                }
            }
        }
    }
    return tmpArr;
}
