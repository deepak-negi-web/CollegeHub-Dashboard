import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Button, Form, Container, Alert } from "react-bootstrap";
import { useAuth } from "../../../Providers";

export default function Auth() {
  const history = useHistory();
  const { login } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      history.push("/");
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err.code === "auth/user-not-found") {
        setError("No user record found!");
      } else if (err.code === "auth/wrong-password")
        setError("Invalid password!");
    }
  };
  if (loading) return <div className="loader">Loggin you in...</div>;
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Admin Login</h2>
            {error && (
              <Alert className="mt-2" variant="danger">
                {error}
              </Alert>
            )}
            <Form onSubmit={onSubmitHandler}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
