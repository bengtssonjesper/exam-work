import React, { useRef, useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import SeatViewer from "../../domain/SeatViewer/SeatViewer";
// import SeatBooker from "./SeatBooker";
import SeatBooker from "../../domain/SeatBooker/SeatBooker";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ref, getDatabase, onValue } from "firebase/database";
import { bookingsActions } from "../../store/bookings";
// import { reduxFormatData } from "../../helper/HelperFunctions";
import {
  reduxFormatOffices,
  reduxFormatBookings,
  reduxFormatUsers,
} from "../../helper/HelperFunctions";
import { useAuth } from "../../contexts/AuthContext";
import {
  DashboardHeader,
  DashboardHeaderRow,
  DashboardHeaderItem,
  DashboardBody,
  ViewerBookerContainer,
  ChangeOfficePicker,
  ShowOnDesktop,
  ShowOnMobile,
} from "./styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import { theme } from "../../styles/theme";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useWindowSize from "../../hooks/useWindowSize";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PropTypes from "prop-types";
import { getStorage, getDownloadURL, ref as sRef } from "firebase/storage";

export default function BookingDashboard() {
  const { currentUser } = useAuth();
  const selectedOfficeRef = useRef("");
  const [selectedOffice, setSelectedOffice] = useState();
  const [showViewerAndBooker, setShowViewerAndBooker] = useState(false);
  const [thisWeeksDates, setThisWeeksDates] = useState([]);
  const [thisWeeksDatesStrings, setThisWeeksDatesStrings] = useState([]);
  const [whatViewer, setWhatViewer] = useState("schedule");
  const [whatBooker, setWhatBooker] = useState("manual");
  const [mapOpen, setMapOpen] = useState(false);
  const [mapUrl, setMapUrl] = useState("Images/NoMapFound");
  const offices = useSelector((state) => state.bookings.offices);
  const darkMode = useSelector((state) => state.bookings.darkMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [width, height] = useWindowSize();
  const storage = getStorage();

  useEffect(() => {
    getThisWeeksDates();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxBookingsRef = ref(db, "bookings");
    if (offices.length === 0) {
      onValue(reduxBookingsRef, (snapshot) => {
        const data = snapshot.val();
        reduxFormatBookings(data, currentUser, dispatch);
      });
    }
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxOfficesRef = ref(db, "offices");
    if (offices.length === 0) {
      onValue(reduxOfficesRef, (snapshot) => {
        const data = snapshot.val();
        reduxFormatOffices(data, dispatch);
      });
    }
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const reduxUsersRef = ref(db, "users");
    onValue(reduxUsersRef, (snapshot) => {
      const data = snapshot.val();
      reduxFormatUsers(data, dispatch);
    });
  }, []);

  function getThisWeeksDates() {
    const today = new Date();
    var tmpArr = [];
    for (var i = 0; i < 7; i++) {
      var tmp = new Date();
      tmp.setDate(today.getDate() + i);
      tmpArr.push(tmp);
    }
    setThisWeeksDates(tmpArr);
    formatThisWeeksDates(tmpArr);
  }

  function formatThisWeeksDates(arr) {
    var tmpArr = [];
    tmpArr = arr.map((date) => {
      const year = date.getFullYear().toString();
      var month =
        date.getMonth().toString() === "12"
          ? "1"
          : (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (day.length < 2) {
        day = "0" + day;
      }
      if (month.length < 2) {
        month = "0" + month;
      }

      var tmpStr = year + "-" + month + "-" + day;
      return tmpStr;
    });
    setThisWeeksDatesStrings(tmpArr);
  }

  function handleOnChange() {
    //Using selectedOffice as state to force rerender of childs on update
    switch (selectedOfficeRef.current.value) {
      case "Behrn Tower":
        setMapUrl("Images/BehrnTower.png");
        break;
      case "Fabriksgatan":
        setMapUrl("Images/Fabriksgatan.png");
        break;
      default:
        setMapUrl("Images/NoMapFound.png");
        break;
    }
    setSelectedOffice(selectedOfficeRef.current.value);
    dispatch(
      bookingsActions.setSelectedOffice(selectedOfficeRef.current.value)
    );
    if (selectedOfficeRef.current.value === "Select an office") {
      setShowViewerAndBooker(false);
    } else {
      setShowViewerAndBooker(true);
    }
  }

  const handleChangeViewer = (event, newValue) => {
    setWhatViewer(newValue);
  };
  const handleChangeBooker = (event, newValue) => {
    setWhatBooker(newValue);
  };

  const handleClickOpen = () => {
    setMapOpen(true);
    handleShowImage();
  };

  const handleClose = (value) => {
    setMapOpen(false);
  };

  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
      onClose(value);
    };

    return (
      <Dialog onClose={handleClose} open={mapOpen}>
        <img id="mapImg" width="min(800px, 95%)"></img>
      </Dialog>
    );
  }
  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };

  function handleShowImage() {
    getDownloadURL(sRef(storage, mapUrl))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        const img = document.getElementById("mapImg");
        img.setAttribute("src", url);
      })
      .catch((error) => {
        // Handle any errors
      });
  }

  return (
    <>
      <DashboardHeader
        style={{
          backgroundColor: darkMode ? "rgb(50,50,50)" : "rgb(225,225,225)",
        }}
      >
        <ShowOnDesktop>
          <DashboardHeaderRow>
            <div>
              <Typography
                variant="h4"
                color={darkMode ? "rgb(225,225,225)" : "rgb(50,50,50)"}
              >
                Viewing option
              </Typography>
              <Divider />
              <Tabs
                value={whatViewer}
                onChange={handleChangeViewer}
                aria-label="primary tabs example"
              >
                <Tab
                  value="text"
                  label="Text"
                  sx={{ color: `${theme.palette.secondary.main}` }}
                />
                <Tab
                  value="schedule"
                  label="Schedule"
                  sx={{ color: `${theme.palette.secondary.main}` }}
                />
              </Tabs>
            </div>
            <Divider orientation="vertical" variant="middle" />
            <div>
              <Typography
                variant="h4"
                color={darkMode ? "rgb(225,225,225)" : "rgb(50,50,50)"}
              >
                Booking option
              </Typography>
              <Divider />
              <Tabs
                value={whatBooker}
                onChange={handleChangeBooker}
                aria-label="icon label tabs example"
              >
                <Tab
                  value="manual"
                  label="Manual"
                  sx={{ color: `${theme.palette.secondary.main}` }}
                />
                <Tab
                  value="automatic"
                  label="Automatic"
                  sx={{ color: `${theme.palette.secondary.main}` }}
                />
              </Tabs>
            </div>
          </DashboardHeaderRow>
        </ShowOnDesktop>
        <ShowOnMobile>
          <FormControl style={{ width: "min(80vw,150px)", margin: "10px" }}>
            <InputLabel variant="standard">Viewer</InputLabel>
            <Select
              onChange={(e) => {
                setWhatViewer(e.target.value);
              }}
              defaultValue={"schedule"}
            >
              <MenuItem value="text">TEXT</MenuItem>
              <MenuItem value="schedule">SCHEDULE</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ width: "min(80vw,150px)", margin: "10px" }}>
            <InputLabel variant="standard">Booker</InputLabel>
            <Select
              onChange={(e) => {
                setWhatBooker(e.target.value);
              }}
              defaultValue={"manual"}
            >
              <MenuItem value="manual">MANUAL</MenuItem>
              <MenuItem value="automatic">AUTOMATIC</MenuItem>
            </Select>
          </FormControl>
        </ShowOnMobile>
      </DashboardHeader>
      <DashboardBody>
        <div style={ChangeOfficePicker}>
          <Form className="mt-2">
            <Form.Select
              aria-label="Default select example"
              onChange={handleOnChange}
              ref={selectedOfficeRef}
            >
              <option>Select an office</option>
              {offices &&
                offices.map((office, i) => {
                  return <option key={i}>{office}</option>;
                })}
            </Form.Select>
          </Form>
          {showViewerAndBooker && (
            <Button onClick={handleClickOpen}>Show Map</Button>
          )}
          <SimpleDialog open={mapOpen} onClose={handleClose} />
        </div>
        {showViewerAndBooker && (
          <ViewerBookerContainer width={width}>
            <div style={{ width: width < 1000 ? "90vw" : "55vw" }}>
              <SeatViewer
                selectedOffice={selectedOffice}
                thisWeeksDates={thisWeeksDates}
                thisWeeksDatesStrings={thisWeeksDatesStrings}
                viewer={whatViewer}
              />
            </div>
            <div
              className="vr"
              style={{ display: width < 1000 ? "none" : "block" }}
            />
            <hr
              style={{
                width: "95%",
                margin: "0 auto",
                display: width < 1000 ? "block" : "none",
              }}
            />
            <div style={{ width: width < 1000 ? "90vw" : "30vw" }}>
              <SeatBooker
                selectedOffice={selectedOffice}
                thisWeeksDates={thisWeeksDates}
                thisWeeksDatesStrings={thisWeeksDatesStrings}
                booker={whatBooker}
              />
            </div>
          </ViewerBookerContainer>
        )}
      </DashboardBody>
    </>
  );
}
