import { createSlice } from "@reduxjs/toolkit";

const initialBookingState = {
  allBookings: [],
  currentUsersBookings: [],
  bookingsByDate: {},
  bookingsByOffice: {},
  seatsByOffice: {},
  offices: [],
};
//Vill vi ha olika states för olika sorteringar?
//T.ex. bookingsByDate, bookingsByOffice etc. eller gör vi filtreringen i appen?

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: initialBookingState,
  reducers: {
    setAllBookings(state, action) {
      state.allBookings = action.payload;
    },
    setCurrentUsersBookings(state, action) {
      state.currentUsersBookings = action.payload;
    },
    setBookingsByDate(state, action) {
      state.bookingsByDate = action.payload;
    },
    setBookingsByOffice(state, action) {
      state.bookingsByOffice = action.payload;
    },
    setSeatsByOffice(state, action) {
      state.seatsByOffice = action.payload;
    },
    setOffices(state, action) {
      state.offices = action.payload;
    },
    // addBooking(state, action) {
    //   state.bookings.push(action.payload)
    //   state.currentUsersBookings.push(action.payload)
    // },
    // deleteBooking(state, action) {
    //   state.bookings.splice(state.bookings.findIndex(booking=>booking.bookingInfo===action.payload),1)
    //   state.currentUsersBookings.splice(state.currentUsersBookings.findIndex(booking=>booking.bookingInfo===action.payload),1)
    // },
  },
});

export const bookingsActions = bookingsSlice.actions;

export default bookingsSlice.reducer;
