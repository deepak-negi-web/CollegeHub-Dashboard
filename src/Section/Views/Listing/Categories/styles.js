import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 1280px;
  .heading {
    text-align: center;
  }

  @media screen and (max-width: 767px) {
    width: calc(100vw - 11vw);
  }
  @media screen and (min-width: 768px) {
    width: calc(100vw - 21vw);
  }
`;
