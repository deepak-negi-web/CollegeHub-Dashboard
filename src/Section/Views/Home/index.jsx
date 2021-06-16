import React from "react";
import { useHistory } from "react-router-dom";
import { Wrapper, Card } from "./styles";
export default function Home() {
  const history = useHistory();
  const handleClick = (path) => {
    history.push(path);
  };
  return (
    <Wrapper>
      <h1 className="heading">Welcome to the CollegeHub Dashboard</h1>
      <div className="grid-view">
        <Card onClick={() => handleClick("/categories")}>Categories</Card>
        <Card onClick={() => handleClick("/courses")}>Courses</Card>
        <Card onClick={() => handleClick("/colleges")}>Colleges</Card>
      </div>
    </Wrapper>
  );
}
