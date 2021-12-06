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

export default function HandleBookings(props) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    console.log("props: ", props);
    setupRows();
  }, [props.bookings]);

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
    console.log("props: ", props.bookings);

    props.bookings.forEach((booking) => {
      rows.push({
        id: booking.bookingId,
        date: booking.date,
        office: booking.office,
        seat: booking.seat,
        startTime: booking.startTime,
        endTime: booking.endTime,
        user: booking.user,
      });
    });
    console.log("bookings: ", rows);
    setRows(rows);
  }

  function handleDeleteBooking(booking) {
    const db = getDatabase();
    console.log("ref: ", "bookings/" + booking.user + "/" + booking.id);
    set(ref(db, "bookings/" + booking.user + "/" + booking.id), {
      //Passing empty object will delete the booking
    })
      .then(console.log("success"))
      .catch((error) => {
        console.log("error");
      });
  }

  return (
    <div>
      {rows && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
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
                      color="danger"
                    >
                      Delete
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
