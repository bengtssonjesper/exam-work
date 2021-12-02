import styled from 'styled-components'
import {theme} from '../../styles/theme'

export const DashboardHeader = styled.div`
    // background-color:${theme.palette.secondary.main};
    background-color:black;
    width:100vw;
    padding:15px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    color:white; 
`

export const DashboardHeaderRow = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:35vw;
`
export const DashboardHeaderItem = styled.div`

`
export const DashboardBody = styled.div`
    width:95vw;
    margin: 0 auto;
`
export const ViewerBookerContainer = styled.div`
    margin: 10px 0;
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
`
export const ChangeOfficePicker = {
    maxWidth:'400px', 
    margin: '20px auto',
}