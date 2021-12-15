import React, { useEffect, useState, useRef } from "react";
import { set, ref, getDatabase } from "firebase/database";
import { Alert } from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function HandleSeats(props) {
  const [offices, setOffices] = useState([]);
  const newSeatRef = useRef();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");

  useEffect(() => {
    setupOffices();
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

  function setupOffices() {
    var offices = [];

    props.offices.forEach((booking) => {
      offices.push({
        id: booking.bookingId,
        date: booking.date,
        office: booking.office,
        seat: booking.seat,
        startTime: booking.startTime,
        endTime: booking.endTime,
        user: booking.user,
      });
    });
    setOffices(offices);
  }

  function handleDeleteSeat(seatToDelete) {
    const db = getDatabase();

    //När vi tar bort ett seat måste även alla bokningar i detta seatet tas bort
    var seats = [];
    props.seatsByOffice[selectedOffice].forEach((seat) => {
      if (seat !== seatToDelete) {
        seats.push(seat);
      }
    });
    if (props.bookingsByOffice[selectedOffice]) {
      props.bookingsByOffice[selectedOffice].forEach((booking) => {
        if (booking.seat === seatToDelete) {
          set(ref(db, "bookings/" + booking.user + "/" + booking.bookingId), {
            //Empty to delete
          });
        }
      });
    }
    set(ref(db, "offices/" + selectedOffice), {
      seats: seats,
    });
  }

  function handleOfficeChange(event) {
    setSelectedOffice(event.target.value);
  }

  function handleAddSeat() {
    const db = getDatabase();
    var seats = [];
    props.seatsByOffice[selectedOffice].forEach((seat) => {
      seats.push(seat);
    });
    seats.push(newSeatRef.current.value);
    seats.sort(function (a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
    set(ref(db, "offices/" + selectedOffice), {
      seats: seats,
    });
  }

  return (
    <div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Office</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selectedOffice}
          onChange={(event) => {
            handleOfficeChange(event);
          }}
          label="Office"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {props.offices.map((office) => {
            return <MenuItem value={office}>{office}</MenuItem>;
          })}
        </Select>
      </FormControl>
      {selectedOffice && (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Office</TableCell>
                <TableCell align="right">Option</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.seatsByOffice &&
                props.seatsByOffice[selectedOffice].map((seat) => (
                  <TableRow
                    key={seat}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {seat}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDeleteSeat(seat)}
                        variant="contained"
                        color="warning"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell>
                  <TextField
                    inputRef={newSeatRef}
                    label="New seat"
                    variant="standard"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAddSeat}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
