import styled from "styled-components";

export const Background = styled.div`
    margin:0;
    padding:0;
    min-height:100vh;
    background-color: #b8c6db;
    background-image: linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%);
    background-size: cover;
    background-position: left top;
    background-attachment: scroll;
`

export const AuthContainer = styled.div`
    height:90vh;
    width:min(400px, 90vw);
    margin: 0 auto;
    display:flex;
    justify-content:center;
    align-items:center;
`

export const AuthCard = styled.div`
    background-color:#fff;
    border: 1px solid rgba(150, 150, 150, 0.5);
    border-radius:5px;
`

export const AuthCardBody = styled.div`
    padding: 15px 10px;
`

export const MainContainer = styled.div`
    background-color:#fff;
    margin:5px;
    padding:8px;
    border: 1px solid rgba(150, 150, 150, 0.5);
    border-radius:5px;

    // @media (min-width: 400px){
    //     margin:30px
    // }
`