import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 1rem;
  width: 90%;
  margin: 0 auto;
  .heading {
    text-align: center;
  }
  .grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 1rem;
  }
`;

export const Card = styled.div`
  width: 100%;
  height: 200px;
  text-align: center;
  border: 1px solid rgb(216, 216, 216);
  display: flex;
  border-radius: 2px;
  margin: 0px;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  justify-content: center;
  align-items: center;
  &:hover {
    background: #f5f5f5;
    cursor: pointer;
  }
`;
