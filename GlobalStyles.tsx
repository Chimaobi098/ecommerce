import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

*{
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    

}

body{
max-width: 450px;
padding: 0;
margin: auto;
height: 100vh;
overflow: hidden;
background-color: #f5f5f5;

}

#__next{
    height: 100%;
    
}

`;
