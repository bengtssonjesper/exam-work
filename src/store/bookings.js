import { createSlice } from "@reduxjs/toolkit";

const initialBookingState = {
  allBookings: [],
  currentUsersBookings: [],
  bookingsByDate: {},
  bookingsByOffice: {},
  seatsByOffice: {},
  offices: [],
  graphicViewTimeRefs: {},
  selectedOffice: null,
  viewDate: null,
  darkMode: false,
  users: [],
};

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
    setGraphicViewTimeRefs(state, action) {
      state.graphicViewTimeRefs = action.payload;
    },
    setSelectedOffice(state, action) {
      state.selectedOffice = action.payload;
    },
    setViewDate(state, action) {
      state.viewDate = action.payload;
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    clearStore(state, action) {
      state.allBookings = [];
      state.currentUsersBookings = [];
      state.bookingsByDate = {};
      state.bookingsByOffice = {};
      state.seatsByOffice = {};
      state.offices = [];
      state.graphicViewTimeRefs = {};
      state.selectedOffice = null;
      state.viewDate = null;
      state.darkMode = true;
      state.users = [];
    },
  },
});

export const bookingsActions = bookingsSlice.actions;

export default bookingsSlice.reducer;
