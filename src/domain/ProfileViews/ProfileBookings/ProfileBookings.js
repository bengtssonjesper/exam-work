import React from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";

export default function ProfileBookings() {
  const currentUsersBookings = useSelector(
    (state) => state.bookings.currentUsersBookings
  );

  const useStyles = makeStyles({
    dataGrid: {
      // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      borderRadius: 3,
      border: 0,
      // color: "white",
      height: 48,
      padding: "0 30px",
      // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
      width: "min(100%,600px)",
      margin: "0 auto",
    },
  });

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    {
      field: "date",
      headerName: "Date",
      width: 100,
    },
    {
      field: "office",
      headerName: "Office",
      width: 140,
    },
    {
      field: "seat",
      headerName: "Seat",
    },
    {
      field: "startTime",
      headerName: "Start Time",
    },
    {
      field: "endTime",
      headerName: "End Time",
    },
  ];

  function structureData(inputData) {
    var myArr = [];
    var myObj = {};
    Object.keys(inputData).forEach((element) => {
      inputData[element].forEach((booking) => {
        myObj = {
          id: booking.bookingId,
          office: booking.office,
          startTime: booking.startTime,
          endTime: booking.endTime,
          date: booking.date,
          seat: booking.seat,
        };
        myArr.push(myObj);
      });
    });

    return myArr;
  }

  const rows = structureData(currentUsersBookings);
  const classes = useStyles();
  return (
    <div>
      <DataGrid
        autoHeight={true}
        disableExtendRowFullWidth={true}
        rows={rows}
        columns={columns}
        pageSize={10}
        className={classes.dataGrid}
      />
    </div>
  );
}
