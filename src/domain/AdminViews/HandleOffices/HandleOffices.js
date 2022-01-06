import React, { useEffect, useState, useRef } from "react";
import { set, ref, getDatabase } from "firebase/database";
import { Alert, Form, FormLabel } from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function HandleOffices(props) {
  const [offices, setOffices] = useState([]);
  const newOfficeRef = useRef();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [enteredOffice, setEnteredOffice] = useState("");

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

  function handleDeleteOffice(office) {
    const db = getDatabase();
    if (props.bookingsByOffice[office]) {
      props.bookingsByOffice[office].forEach((booking) => {
        set(ref(db, "bookings/" + booking.user + "/" + booking.bookingId), {
          //Empty to delete
        })
          .then(setMessage("Office and its bookings deleted"))
          .catch((error) => {
            setError("Something went wrong, office was not deleted");
          });
      });
    }
    set(ref(db, "offices/" + office), {
      //Empty to delete
    })
      .then(setMessage("Office deleted"))
      .catch((error) => {
        setError("Something went wrong, office was not deleted");
      });
  }

  function handleAddOffice(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    const db = getDatabase();
    if (enteredOffice === "") {
      setError("You must enter an office name");
    } else if (props.offices.includes(enteredOffice)) {
      setError("Office already exist");
    } else {
      set(ref(db, "offices/" + enteredOffice), {
        seats: ["seat1"],
      });
      setMessage("Office was added");
    }
  }

  function handleOfficeInputChange(e) {
    setEnteredOffice(e.target.value);
  }

  return (
    <div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {offices && (
        <TableContainer
          component={Card}
          raised
          style={{ width: "min(800px,95%)", margin: "auto" }}
        >
          <Table
            // sx={{ minWidth: 650 }}
            size="small"
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Office</TableCell>
                <TableCell align="right">Option</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.offices &&
                props.offices.map((office) => (
                  <TableRow
                    key={office}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {office}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleDeleteOffice(office)}
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
                    onChange={handleOfficeInputChange}
                    inputRef={newOfficeRef}
                    label="New office"
                    variant="standard"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAddOffice}
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
