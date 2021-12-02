import { ref, set, getDatabase } from "@firebase/database";
import { bookingsActions } from "../store/bookings";
import { v4 as uuidv4 } from "uuid";

export function createBooking(
  seat,
  date,
  thisWeeksDates,
  currentUser,
  startTime,
  endTime,
  bookingsByOffice,
  selectedOffice,
  setError,
  setMessage
) {
  var compareArray = bookingsByOffice[selectedOffice].filter(
    (booking) => booking.date === date && booking.seat === seat
  );

  try {
    if (seat === "Select a seat") {
      throw "Please select a seat";
    } else if (!thisWeeksDates.includes(date)) {
      throw "You can only book one week ahead";
    } else if (isBookingAllowed(startTime, endTime, compareArray)) {

      const db = getDatabase();
      const uid = uuidv4();
      try {
        set(
          ref(
            db,
            "Offices/" +
              selectedOffice +
              "/bookings/" +
              currentUser._delegate.uid +
              "/" +
              uid
          ),
          {
            user: currentUser._delegate.uid,
            seat: seat,
            date: date,
            startTime: startTime,
            endTime: endTime,
            office: selectedOffice,
            bookingId: uid,
          }
        );
        setMessage("Booking successful");
      } catch (error) {
        setError("Failed to post to database");
      }
    } else {
      throw "Booking not allowed, please change input data";
    }
  } catch (error) {
    setError(error);
  }
}

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

function isBookingAllowed(selectedStartTime, selectedEndTime, compareArray) {
  //Needed input: selectedStartTime, selectedEndTime, compareArray,
  var isAllowed = true;
  var startTimeDate = new Date();
  var endTimeDate = new Date();
  startTimeDate.setHours(
    parseInt(selectedStartTime.substr(0, 2)),
    parseInt(selectedStartTime.substr(3, 2))
  );
  endTimeDate.setHours(
    parseInt(selectedEndTime.substr(0, 2)),
    parseInt(selectedEndTime.substr(3, 2))
  );
  compareArray.forEach((booking) => {
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
      (startTimeDate > cmpStart && startTimeDate < cmpEnd) ||
      (endTimeDate > cmpStart && endTimeDate < cmpEnd)
    ) {
      isAllowed = false;
      throw "Collision with another booking, please change times";
    }
  });
  return isAllowed;
}

export function isCollision(selectedStartTime, selectedEndTime, compareArray) {
  //Input: selectedStartTime, selectedEndTime, compareArray
  //Output: isColission:bool
  //Checks if a booking is colliding with any other booking on that seat/date/office

  var isCollision = false;

  compareArray.forEach((booking) => {
    if (
      (selectedStartTime >= booking.startTime &&
        selectedStartTime <= booking.endTime) ||
      (selectedEndTime >= booking.startTime &&
        selectedEndTime <= booking.endTime)
    ) {
      isCollision = true;
    }
  });
  return isCollision;
}

export function reduxFormatData(data, currentUser, dispatch) {
  const today = new Date();
  var allBookingsArr = [];
  var currentUsersBookingsByDateObj = {};
  var bookingsByDateObj = {};
  var bookingsByOfficeObj = {};
  var seatsByOffice = {};
  var offices = [];
  var currentUsersBookingsDays = [];

  console.log("Redux format: ", data);
  for (const [officeName, officeObject] of Object.entries(data)) {
    offices.push(officeName);
    if ("seats" in officeObject) {
      seatsByOffice[officeName] = officeObject["seats"];
    }
    if ("bookings" in officeObject) {
      for (const [bookerId, bookingsObject] of Object.entries(
        officeObject.bookings
      )) {
        for (const [bookingId, booking] of Object.entries(bookingsObject)) {
          allBookingsArr.push(booking);
          if (booking.date in bookingsByDateObj) {
            bookingsByDateObj[booking.date].push(booking);
          } else {
            bookingsByDateObj[booking.date] = [booking];
          }

          if (booking.user === currentUser._delegate.uid) {
            var cmpDate = new Date();
            const year = booking.date.substr(0, 4);
            const month = booking.date.substr(5, 2);
            const date = booking.date.substr(8, 2);

            cmpDate.setFullYear(year, month - 1, date);
            cmpDate.setHours(23, 59, 59);

            if (cmpDate >= today) {
              if (booking.date in currentUsersBookingsByDateObj) {
                currentUsersBookingsByDateObj[booking.date].push(booking);
              } else {
                currentUsersBookingsByDateObj[booking.date] = [booking];
              }
            }
          }

          if (booking.office in bookingsByOfficeObj) {
            bookingsByOfficeObj[booking.office].push(booking);
          } else {
            bookingsByOfficeObj[booking.office] = [booking];
          }
        }
      }
    }
  }
  dispatch(bookingsActions.setAllBookings(allBookingsArr));
  dispatch(bookingsActions.setSeatsByOffice(seatsByOffice));
  dispatch(
    bookingsActions.setCurrentUsersBookings(currentUsersBookingsByDateObj)
  );
  dispatch(bookingsActions.setBookingsByDate(bookingsByDateObj));
  dispatch(bookingsActions.setBookingsByOffice(bookingsByOfficeObj));
  dispatch(bookingsActions.setOffices(offices));
  // Object.keys(currentUsersBookingsByDateObj).forEach((day) =>
  //   currentUsersBookingsDays.push(day)
  // );
  // currentUsersBookingsDays.sort((a, b) => {
  //   var dateA = new Date();
  //   var dateB = new Date();
  //   dateA.setFullYear(a.substr(0, 4), a.substr(5, 2), a.substr(8, 2));
  //   dateB.setFullYear(b.substr(0, 4), b.substr(5, 2), b.substr(8, 2));
  //   if (dateA < dateB) {
  //     return -1;
  //   } else if (dateB < dateA) {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  // });
}
