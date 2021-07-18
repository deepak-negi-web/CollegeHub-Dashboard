import React, { useState } from "react";
import { Form, Image, Container, Button } from "react-bootstrap";
export default function AssetsComp() {
  const [images, setImages] = useState([]);

  const onAddingImages = (e) => {
    const files = e.target.files;
    const filesAdded = Object.keys(files).map((file) => ({ file }));
    setImages((prev) => ({
      ...prev,
      ...filesAdded,
    }));
  };
  return (
    <Container fluid>
      <div className="d-flex justify-content-between">
        <h5>Add Images to the college</h5>
        <p>
          <Button
            variant="primary"
            // onClick={addHandler}
            // disabled={isAddingCourses}
          >
            Upload Assets
          </Button>
        </p>
      </div>
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Multiple files input example</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={onAddingImages}
        />
        {/* {images.map((image) => (
          <Image key={image} src={image?.url} thumbnail />
        ))} */}
      </Form.Group>
    </Container>
  );
}
