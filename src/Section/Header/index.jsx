import React from "react";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { StyleHeader, BrandLogo, NavBar, Spacer } from "./styles";
import { useAuth } from "../../Providers";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <StyleHeader>
      <NavBar>
        <BrandLogo>
          <img src="/logo.jpg" alt="brand-logo" />
          <NavLink className="brand-link" to="/">
            CollegeHub Dashboard
          </NavLink>
        </BrandLogo>
        <Spacer />
        {isAuthenticated && <h2>Welcome Admin</h2>}
        <Spacer />
        <ul>
          <NavLink className="link " to="/categories">
            Categories
          </NavLink>

          <NavLink className="link" to="/courses">
            Courses
          </NavLink>
          <NavLink className="link" to="/colleges">
            Colleges
          </NavLink>
          {isAuthenticated && (
            <Button variant="danger" onClick={() => logout()}>
              Logout
            </Button>
          )}
        </ul>
      </NavBar>
    </StyleHeader>
  );
}
