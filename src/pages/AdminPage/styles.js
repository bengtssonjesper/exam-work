import styled from "styled-components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { color } from "@mui/system";

export const AdminHeader = styled.div`
  width: 100vw;
  padding: 20px;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: -1;
`;

export const AdminBody = styled.div`
  width: 90vw;
  margin: 30px auto 0 auto;
  display: flex;
  justify-content: center;
`;

export const ProfileInfo = styled.div`
  width: 90vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;
export const ProfileBookings = styled.div`
  width: 90vw;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
export const ProfileBodyHeaderText = styled.p`
  margin-top: 20px;
`;

export const AccordionStyles = {
  width: "95vw",
};
export const EditProfileButtonStyles = {
  width: "auto",
};

export const ShowOnDesktop = styled.div`
  display: block;
  @media (max-width: 700px) {
    display: none;
  }
`;
export const ShowOnMobile = styled.div`
  display: block;
  @media (min-width: 700px) {
    display: none;
  }
`;
