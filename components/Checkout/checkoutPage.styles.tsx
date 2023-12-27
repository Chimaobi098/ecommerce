import styled from "styled-components";

export const WrapperCard = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0 3vw;
  padding-bottom: 20vh;
  background-color: "#FFFFF";

  overflow-y: scroll;

  .input-field {
    width: 100%;
  }

  .section-title {
    font-weight: 500;
    font-size: 1.5rem;
  }
`;

export const CardStyle = styled.div`
  width: 100%;
  box-shadow: "10px 10px 20px";
  min-height: 15vh;
  background: white;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 2vh;
  position: relative;

  .item-details-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  #total-container {
    margin: 1rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .Add-button{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 10px;
  }
  
`;

export const Button =  styled.div`
    border: 2px solid black;
    background-color: black;

  .Add-button{
     border: 4px solid blue;
     padding: 2px;
  }

`;
