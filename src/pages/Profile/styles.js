import styled from 'styled-components'
import useMediaQuery from '@mui/material/useMediaQuery';
import { color } from '@mui/system';


export const ProfileHeader = styled.div`
    width:100vw;
    padding:20px;
    background-color:#000;
    color:#fff;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    z-index:-1;
`

export const ProfileBody = styled.div`
    width:100vw;
    
`
export const ProfileInfo = styled.div`
    width:90vw;
    margin:0 auto;
    display:flex;
    flex-direction:column;

`
export const ProfileBookings = styled.div`
    width:90vw;
    margin:0 auto;
    text-align:center;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-between;

`
export const ProfileBodyHeaderText = styled.p`
    margin-top: 20px;

`

export const AccordionStyles = {
    width:'95vw',
}
export const EditProfileButtonStyles = {
    width:'auto',
}


