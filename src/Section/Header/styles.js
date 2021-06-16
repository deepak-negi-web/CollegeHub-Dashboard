import styled from "styled-components";

export const StyleHeader = styled.header`
  width: 100%;
  height: 64px;
  position: sticky;
  top: 0;
  left: 0;
  background: #fff;
  box-shadow: 0 8px 6px -6px #a8dadc;
  z-index: 10;
  a {
    color: #1d3557;
  }
`;

export const BrandLogo = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: flex-end;
  .brand-link {
    font-size: 1.5rem;
    font-weight: 600;
    text-decoration: none;
  }
  img {
    width: 40px;
  }
  .brand-link:hover {
    text-decoration: none;
  }
  @media (min-width: 769px) {
    margin-left: 0;
  }
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const NavBar = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 1rem;
  ul {
    list-type: none;
    display: flex;
    padding: 0;
    margin: 0;
    @media (max-width: 768px) {
      display: none;
    }
  }
  .link {
    font-size: 16px;
    text-decoration: none;
    padding: 8px;
  }
`;
