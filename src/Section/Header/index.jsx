import React from "react";
import { NavLink } from "react-router-dom";
import { StyleHeader, BrandLogo, NavBar, Spacer } from "./styles";

export default function Header() {
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
        </ul>
      </NavBar>
    </StyleHeader>
  );
}
