import React from "react";
import { Row, Col } from "react-bootstrap";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ScheduleHeadings(props) {
  const mobileView = useMediaQuery("(max-width:600px)");
  // const mobileView = true

  return (
    <Row>
      <Col xs="2">Seat</Col>
      <Col xs="10" className="d-flex justify-content-between">
        {props.workHoursArray &&
          props.workHoursArray.map((hour, i) => {
            return (
              <p
                key={i}
                style={{
                  visibility: mobileView && i % 2 == 0 ? "hidden" : "visible",
                }}
              >
                {hour}
              </p>
            );
          })}
      </Col>
    </Row>
  );
}
