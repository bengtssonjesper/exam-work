import styled from "styled-components";
import { theme } from "../../styles/theme";

export const DashboardHeader = styled.div`
  // background-color:${theme.palette.secondary.main};
  background-color: black;
  width: 100vw;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

export const DashboardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 500px;
`;

export const DashboardHeaderItem = styled.div``;
export const DashboardBody = styled.div`
  width: 95vw;
  margin: 0 auto;
`;
export const ViewerBookerContainer = styled.div`
  margin: 10px 0;
  display: flex;

  align-items: flex-start;
  justify-content: center;
  ${({ width }) =>
    width > 1000
      ? `
  flex-direction: row;
`
      : `
flex-direction: column;`}
`;
export const ChangeOfficePicker = {
  maxWidth: "400px",
  margin: "20px auto",
};

export const ShowOnDesktop = styled.div`
  @media (max-width: 700px) {
    display: none;
  }
`;
export const ShowOnMobile = styled.div`
  display: inline-block;
  @media (min-width: 700px) {
    display: none;
  }
`;
