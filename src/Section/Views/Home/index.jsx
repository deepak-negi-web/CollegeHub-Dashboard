import React from "react";
import { useHistory } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { Wrapper, Card } from "./styles";
import { useAuth } from "../../../Providers";
export default function Home() {
  const { isAuthenticated } = useAuth();
  const history = useHistory();
  const handleClick = (path) => {
    history.push(path);
  };
  return (
    <Wrapper>
      {!isAuthenticated && (
        <Alert variant="info">For CRUD Operation please login</Alert>
      )}
      <div className="grid-view">
        <Card onClick={() => handleClick("/categories")}>Categories</Card>
        <Card onClick={() => handleClick("/courses")}>Courses</Card>
        <Card onClick={() => handleClick("/colleges")}>Colleges</Card>
      </div>
    </Wrapper>
  );
}
