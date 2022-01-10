import React, { useEffect, useState } from "react";
import { set, ref, getDatabase } from "firebase/database";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";
import BookingModal from "../../../components/BookingModal/BookingModal";

export default function HandleBookings(props) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const bookingsByDate = useSelector((state) => state.bookings.bookingsByDate);
  const [show, setShow] = useState(false);
  const [clickedBooking, setClickedBooking] = useState({});

  useEffect(() => {
    setupRows();
  }, [props.bookings]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "date", headerName: "Date" },
    { field: "office", headerName: "Office" },
    { field: "seat", headerName: "Seat", type: "string" },
    {
      field: "startTime",
      headerName: "Start Time",
    },
    {
      field: "endTime",
      headerName: "End Time",
    },
  ];

  function setupRows() {
    var rows = [];

    props.bookings.forEach((booking) => {
      rows.push({
        bookingId: booking.bookingId,
        date: booking.date,
        office: booking.office,
        seat: booking.seat,
        startTime: booking.startTime,
        endTime: booking.endTime,
        user: booking.user,
      });
    });
    setRows(rows);
  }

  function handleDeleteBooking(booking) {
    const db = getDatabase();
    set(ref(db, "bookings/" + booking.user + "/" + booking.bookingId), {
      //Passing empty object will delete the booking
    });
  }

  function handleUpdateBooking(booking) {
    setClickedBooking(booking);
    handleShow();
  }

  return (
    <div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="success">{error}</Alert>}
      {show && (
        <BookingModal
          fromAdminModal={true}
          setShow={setShow}
          show={show}
          booking={clickedBooking}
          handleClose={handleClose}
        />
      )}
      {rows && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Office</TableCell>
                <TableCell align="right">Seat</TableCell>
                <TableCell align="right">Start Time</TableCell>
                <TableCell align="right">End Time</TableCell>
                <TableCell align="right">Option</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((booking) => (
                <TableRow
                  key={booking.bookingId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {booking.date}
                  </TableCell>
                  <TableCell align="right">{booking.office}</TableCell>
                  <TableCell align="right">{booking.seat}</TableCell>
                  <TableCell align="right">{booking.startTime}</TableCell>
                  <TableCell align="right">{booking.endTime}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => handleDeleteBooking(booking)}
                      variant="contained"
                      color="error"
                      style={{ margin: "5px" }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleUpdateBooking(booking)}
                      variant="contained"
                      color="warning"
                      style={{ margin: "5px" }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
