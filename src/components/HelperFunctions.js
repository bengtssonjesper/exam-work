import { ref, set, getDatabase } from "@firebase/database";

export function updateBooking(
  newStartTime,
  newEndTime,
  booking,
  arrayOfBookings,
  setError,
  setMessage
) {
  const db = getDatabase();
  setError("");
  setMessage("");
  const refStr =
    "Offices/" +
    booking["office"] +
    "/bookings/" +
    booking["user"] +
    "/" +
    booking["bookingId"];
  try {
    if (isBookingAllowed(newStartTime, newEndTime, arrayOfBookings)) {
      set(ref(db, refStr), {
        bookingId: booking["bookingId"],
        date: booking["date"],
        endTime: newEndTime,
        office: booking["office"],
        seat: booking["seat"],
        startTime: newStartTime,
        user: booking["user"],
      });
      setMessage("Success");
    } else {
      setError("Some error");
    }
  } catch (error) {
    setError(error);
  }
}

export function isBookingAllowed(startTime, endTime, arrayOfBookings) {
  //Input: startTime: string, endTime:string, arrayOfBookings: array[Booking]
  //Output: if booking is allowed or not, as bool
  var isAllowed = true;
  var startTimeDate = new Date();
  var endTimeDate = new Date();
  startTimeDate.setHours(
    parseInt(startTime.substr(0, 2)),
    parseInt(startTime.substr(3, 2))
  );
  endTimeDate.setHours(
    parseInt(endTime.substr(0, 2)),
    parseInt(endTime.substr(3, 2))
  );
  arrayOfBookings.forEach((booking) => {
    var cmpStart = new Date();
    var cmpEnd = new Date();
    cmpStart.setHours(
      booking.startTime.substr(0, 2),
      booking.startTime.substr(3, 2)
    );
    cmpEnd.setHours(booking.endTime.substr(0, 2), booking.endTime.substr(3, 2));
    if (startTimeDate >= endTimeDate) {
      isAllowed = false;
      throw "End time must be greater than start time";
    } else if (
      (startTimeDate >= cmpStart && startTimeDate <= cmpEnd) ||
      (endTimeDate >= cmpStart && endTimeDate <= cmpEnd)
    ) {
      isAllowed = false;
      throw "Collision with another booking, please change times";
    }
  });
  return isAllowed;
}
