import React, { useState, useRef } from "react";
import { useSubscription } from "@apollo/client";
import { ReactTabulator } from "react-tabulator";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { Wrapper } from "./styles";
import { DeleteIcon } from "../../../../Assets/icons";
import tableOptions from "../../../../tableOptions";
import { COLLEGES, COURSES } from "../../../../GraphQl";
import { getBooleanKeys, getBooleanObject } from "../../../../utils";
import collegeMetaData from "../../../../collegeMetaData.json";

export default function Colleges() {
  const [modalShow, setModalShow] = useState(false);
  const [facility, setFacility] = useState(
    getBooleanObject(collegeMetaData.facility)
  );
  const nameRef = useRef("");
  const locationRef = useRef(1);
  const courseRef = useRef("");
  const descriptionRef = useRef("");
  const {
    data: { colleges_college: colleges = [] } = {},
    loading,
    error,
  } = useSubscription(COLLEGES);
  const {
    data: { courses_courses: courses = [] } = {},
    loading: isCoursesLoading,
    error: coursesError,
  } = useSubscription(COURSES);

  const columns = [
    {
      title: "Id",
      field: "id",
      width: "100",
      headerFilter: true,
      cssClass: "rowClick",
      hozAlign: "left",
    },
    {
      title: "Name",
      field: "name",
      width: "300",
      headerFilter: true,
      hozAlign: "left",
    },
    {
      title: "Location",
      field: "location",
      headerFilter: true,
      hozAlign: "left",
    },
  ];

  const closeModal = () => {
    setModalShow(false);
  };

  const checkboxHandler = (e) => {
    const checked = e.target.checked;
    const name = e.target.name;
    setFacility((prev) => {
      return {
        ...prev,
        [name]: checked,
      };
    });
  };

  if (loading || isCoursesLoading)
    return <div className="loader">Loading...</div>;
  if (error || coursesError) {
    console.error(error || coursesError);
  }
  return (
    <Wrapper>
      <h1 className="heading">College Listing</h1>
      <Button
        variant="primary"
        className="mb-4"
        onClick={() => setModalShow(true)}
      >
        Add Colleges
      </Button>
      {Boolean(colleges) && (
        <ReactTabulator
          columns={columns}
          data={colleges}
          options={{
            ...tableOptions,
            placeholder: "No Colleges Available Yet !",
          }}
          // ref={tableRef}
        />
      )}

      <Modal
        show={modalShow}
        onHide={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add College</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                ref={nameRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                ref={locationRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                ref={descriptionRef}
              />
            </Form.Group>

            <Form.Group>
              <Form.File
                id="college-image"
                label="Images"
                accept="image/*"
                multiple
              />
            </Form.Group>

            <Form.Group>
              <Form.Label> Facility</Form.Label>
              <br />
              {getBooleanKeys(collegeMetaData.facility).map((key, index) => {
                return (
                  <Form.Check
                    key={key}
                    inline
                    label={key}
                    name={key}
                    type="checkbox"
                    id={index}
                    checked={facility[key]}
                    onChange={checkboxHandler}
                  />
                );
              })}
            </Form.Group>
            <Form.Group>
              <Form.Label>Course category</Form.Label>
              <Form.Control as="select" multiple ref={courseRef}>
                {courses.map((course) => {
                  return (
                    <option key={course?.id} value={course?.id}>
                      {course?.name}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() =>
                console.log({
                  name: nameRef.current.value,
                  location: locationRef.current.value,
                  description: descriptionRef.current.value,
                  course: Array.from(
                    courseRef.current.selectedOptions,
                    (item) => +item.value
                  ),
                  facility,
                })
              }
            >
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Wrapper>
  );
}
