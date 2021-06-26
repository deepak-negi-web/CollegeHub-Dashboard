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
          <NavLink
            className="link"
            activeClassName="active-link"
            to="/categories"
          >
            Categories
          </NavLink>

          <NavLink className="link" activeClassName="active-link" to="/courses">
            Courses
          </NavLink>
          <NavLink
            className="link"
            activeClassName="active-link"
            to="/colleges"
          >
            Colleges
          </NavLink>
          {isAuthenticated ? (
            <Button variant="danger" onClick={() => logout()}>
              Logout
            </Button>
          ) : (
            <NavLink
              className="link"
              activeClassName="active-link"
              to="/admin-auth"
            >
              Login
            </NavLink>
          )}
        </ul>
      </NavBar>
    </StyleHeader>
  );
}
